#!/usr/bin/env python3
"""
Utilitário de sincronização direta com Backblaze B2 (S3 API).
Utiliza apenas a biblioteca padrão do Python 3 (hashlib, hmac, urllib).
Não requer instalação de nenhuma biblioteca externa (como boto3 ou awscli).
"""

import sys
import os
import datetime
import hashlib
import hmac
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path

def load_env(env_path=None):
    """Carrega variáveis do arquivo .env"""
    if env_path is None:
        root_dir = Path(__file__).resolve().parent.parent
        env_path = root_dir / '.env'
    
    config = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    config[k.strip()] = v.strip().strip('"').strip("'")
    
    # Sobrescreve com variáveis de ambiente do sistema se existirem
    for k in ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_REGION']:
        if k in os.environ:
            config[k] = os.environ[k]
            
    return config

def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()

def get_signature_key(key, date_stamp, region_name, service_name):
    k_date = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    k_region = sign(k_date, region_name)
    k_service = sign(k_region, service_name)
    k_signing = sign(k_service, 'aws4_request')
    return k_signing

def request_s3(method, config, s3_key, file_data=None):
    """Executa requisição autenticada via AWS SigV4 para o Backblaze B2"""
    endpoint = config.get('S3_ENDPOINT', 'https://s3.us-east-005.backblazeb2.com')
    bucket = config.get('S3_BUCKET', 'semana-tec-backups')
    access_key = config.get('S3_ACCESS_KEY_ID', '')
    secret_key = config.get('S3_SECRET_ACCESS_KEY', '')
    region = config.get('S3_REGION', 'us-east-005')
    service = 's3'

    if not access_key or not secret_key:
        raise ValueError("Credenciais S3_ACCESS_KEY_ID ou S3_SECRET_ACCESS_KEY não encontradas no .env")

    parsed_url = urllib.parse.urlparse(endpoint)
    host = parsed_url.netloc
    
    # Normaliza caminho do S3
    s3_key = s3_key.lstrip('/')
    canonical_uri = f"/{bucket}/{urllib.parse.quote(s3_key)}"
    request_url = f"{endpoint}/{bucket}/{urllib.parse.quote(s3_key)}"

    t = datetime.datetime.now(datetime.timezone.utc)
    amz_date = t.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = t.strftime('%Y%m%d')

    if file_data is not None:
        payload_hash = hashlib.sha256(file_data).hexdigest()
        content_length = str(len(file_data))
    else:
        payload_hash = hashlib.sha256(b'').hexdigest()
        content_length = '0'

    canonical_headers = f'host:{host}\nx-amz-content-sha256:{payload_hash}\nx-amz-date:{amz_date}\n'
    signed_headers = 'host;x-amz-content-sha256;x-amz-date'

    canonical_request = f"{method}\n{canonical_uri}\n\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    algorithm = 'AWS4-HMAC-SHA256'
    credential_scope = f"{date_stamp}/{region}/{service}/aws4_request"
    string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()}"

    signing_key = get_signature_key(secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()

    auth_header = f"{algorithm} Credential={access_key}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"

    headers = {
        'Host': host,
        'x-amz-date': amz_date,
        'x-amz-content-sha256': payload_hash,
        'Authorization': auth_header
    }
    if method == 'PUT' and file_data is not None:
        headers['Content-Length'] = content_length
        headers['Content-Type'] = 'application/octet-stream'

    req = urllib.request.Request(request_url, data=file_data if method == 'PUT' else None, headers=headers, method=method)
    return urllib.request.urlopen(req)

def upload(local_file, s3_key=None):
    config = load_env()
    local_path = Path(local_file)
    if not local_path.exists():
        print(f"❌ Arquivo local não encontrado: {local_file}", file=sys.stderr)
        sys.exit(1)

    if not s3_key:
        s3_key = f"backups/{local_path.name}"

    print(f"☁️ [Backblaze B2] Enviando '{local_path.name}' ({local_path.stat().st_size} bytes) para 's3://{config.get('S3_BUCKET')}/{s3_key}'...")
    
    with open(local_path, 'rb') as f:
        data = f.read()

    try:
        with request_s3('PUT', config, s3_key, data) as resp:
            if resp.status in (200, 201):
                print(f"✅ [Backblaze B2] Upload concluído com sucesso!")
            else:
                print(f"⚠️ Resposta com status: {resp.status}")
    except urllib.error.HTTPError as e:
        print(f"❌ [Backblaze B2] Falha no upload: HTTP {e.code} - {e.read().decode('utf-8', errors='ignore')}", file=sys.stderr)
        sys.exit(1)

def download(s3_key, local_file=None):
    config = load_env()
    if not local_file:
        local_file = s3_key.split('/')[-1]

    local_path = Path(local_file)
    local_path.parent.mkdir(parents=True, exist_ok=True)

    print(f"📥 [Backblaze B2] Baixando 's3://{config.get('S3_BUCKET')}/{s3_key}' para '{local_path}'...")

    try:
        with request_s3('GET', config, s3_key) as resp:
            data = resp.read()
            with open(local_path, 'wb') as f:
                f.write(data)
            print(f"✅ [Backblaze B2] Download concluído com sucesso! ({len(data)} bytes salvos)")
    except urllib.error.HTTPError as e:
        print(f"❌ [Backblaze B2] Falha no download: HTTP {e.code} - {e.read().decode('utf-8', errors='ignore')}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Uso:")
        print("  python3 scripts/s3_sync.py upload <arquivo_local> [caminho_s3]")
        print("  python3 scripts/s3_sync.py download <caminho_s3> [arquivo_local]")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    arg1 = sys.argv[2]
    arg2 = sys.argv[3] if len(sys.argv) > 3 else None

    if cmd == 'upload':
        upload(arg1, arg2)
    elif cmd == 'download':
        download(arg1, arg2)
    else:
        print(f"Comando desconhecido: {cmd}", file=sys.stderr)
        sys.exit(1)

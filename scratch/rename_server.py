import os

files = {
    'server/app/main.py': [('EcoTrace', 'Krishi Saarathi')],
    'server/sql/schema.sql': [('EcoTrace Database Schema', 'Krishi Saarathi Database Schema')],
    'server/sql/seed.sql': [
        ('-- EcoTrace Seed Data', '-- Krishi Saarathi Seed Data'),
        ('admin@ecotrace.com', 'admin@krishisaarathi.com'),
        ('Referred 5 farmers to EcoTrace platform', 'Referred 5 farmers to Krishi Saarathi platform')
    ],
    'server/app/__init__.py': [('# EcoTrace Server Application', '# Krishi Saarathi Server Application')],
    'server/app/config.py': [('app_name: str = "EcoTrace API"', 'app_name: str = "Krishi Saarathi API"')]
}

for file_path, replacements in files.items():
    full_path = os.path.join('/Users/amritpaudel/Downloads/EcoTracer/ecotrace', file_path)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            content = f.read()
        for old, new in replacements:
            content = content.replace(old, new)
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")


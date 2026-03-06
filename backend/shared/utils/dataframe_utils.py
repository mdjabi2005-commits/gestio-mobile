# Colonnes standard pour les transactions (utilisées par le parsing)
TRANSACTION_COLUMNS = [
    "id", "type", "categorie", "sous_categorie", "description",
    "montant", "date", "source", "recurrence", "date_fin",
    "compte_iban", "external_id"
]

# Colonnes standard pour les pièces jointes
ATTACHMENT_COLUMNS = [
    "id", "transaction_id", "file_name", "file_path",
    "file_type", "upload_date"
]

__all__ = ['TRANSACTION_COLUMNS', 'ATTACHMENT_COLUMNS']

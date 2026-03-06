"""
Utilitaires pour le parsing des montants.
Fonctions de conversion de chaînes de caractères en montants numériques.
Compatible Pyodide (pas de pandas).
"""

import logging

logger = logging.getLogger(__name__)


def parse_amount(value) -> float:
    """
    Convertit une valeur en montant float.

    Gère les formats:
    - Européen: 1.234,56
    - Américain: 1,234.56
    - Avec symbols: 100€, $50, etc.

    Args:
        value: Valeur brute (str, int, float, etc.)

    Returns:
        Montant converti en float, ou 0.0 si échec
    """
    if value is None or value == "" or (isinstance(value, float) and value != value):
        return 0.0

    s = str(value).strip()
    s = s.replace("€", "").replace("EUR", "").replace("$", "").replace(" ", "").replace("\xa0", "")

    if "," in s and "." not in s:
        s = s.replace(",", ".")
    elif "," in s and "." in s:
        if s.rfind(",") > s.rfind("."):
            s = s.replace(".", "").replace(",", ".")
        else:
            s = s.replace(",", "")

    try:
        return float(s)
    except ValueError:
        logger.warning(f"Impossible de convertir '{value}' en montant")
        return 0.0

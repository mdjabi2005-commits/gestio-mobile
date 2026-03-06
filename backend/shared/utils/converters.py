"""
Utilitaires de conversion partagés entre tous les domaines.
Utilisés notamment lors des imports CSV/OFX pour normaliser
les valeurs brutes avant de construire les objets métier.
Compatible Pyodide (pas de pandas).
"""

import logging
import re
from datetime import datetime, date
from typing import Any, Optional, Type, Union

from dateutil import parser

logger = logging.getLogger(__name__)


def normalize_text(text: Any) -> str:
    """
    Normalise un texte en Title Case sans espaces superflus.

    Examples:
        >>> normalize_text("  alimentation  ")
        'Alimentation'
    """
    if not text or not str(text).strip():
        return ""
    return " ".join(str(text).split()).title()


def _is_null(value: Any) -> bool:
    """Check if value is null/empty. Compatible with Pyodide."""
    if value is None:
        return True
    if isinstance(value, float):
        return value != value
    if isinstance(value, (str, int)):
        return str(value).strip() == ""
    return False


def safe_convert(
        value: Any,
        convert_type: Type = float,
        default: Union[float, int, str] = 0.0,
) -> Union[float, int, str]:
    """
    Convertit une valeur brute avec détection automatique du format.

    Pour float : détecte le format européen (1.234,56) vs américain (1,234.56).
    """
    try:
        if _is_null(value):
            return default

        value_str = str(value).strip()

        if convert_type == float:
            value_str = (
                value_str
                .replace(" ", "")
                .replace("€", "")
                .replace('"', "")
                .replace("'", "")
            )
            last_comma = value_str.rfind(",")
            last_dot = value_str.rfind(".")

            if last_comma > last_dot:
                value_str = value_str.replace(".", "").replace(",", ".")
            elif last_dot > last_comma:
                value_str = value_str.replace(",", "")
            else:
                if "," in value_str:
                    value_str = value_str.replace(",", ".")

            value_str = re.sub(r"[^\d.-]", "", value_str)
            return round(float(value_str), 2)

        elif convert_type == int:
            return int(float(value_str))
        elif convert_type == str:
            return value_str
        else:
            return convert_type(value)

    except (ValueError, TypeError, AttributeError) as e:
        logger.warning(f"Conversion échouée pour '{value}': {e}")
        return default


def safe_date_convert(
        date_str: Any,
        default: Optional[date] = None,
) -> date:
    """
    Convertit une chaîne de date en objet date.

    Formats supportés : ISO (2025-01-15), européen (15/01/2025),
    américain (2025/01/15), et variantes avec tirets ou points.
    """
    if default is None:
        default = datetime.now().date()

    if date_str is None or str(date_str).strip() == "":
        return default

    if _is_null(date_str):
        return default

    date_str = str(date_str).strip()
    formats = [
        "%Y-%m-%d", "%d/%m/%Y", "%d/%m/%y",
        "%Y/%m/%d", "%d-%m-%Y", "%d-%m-%y",
        "%d.%m.%Y", "%d.%m.%y",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue

    try:
        return parser.parse(date_str, dayfirst=True, fuzzy=True).date()
    except Exception as e:
        logger.warning(f"Conversion date échouée pour '{date_str}': {e}")
        return default


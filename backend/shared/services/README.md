# ⚙️ Shared Services

> Services utilitaires transversaux.

## 📂 File Service (`file_service.py`)

> **À abstrayer** pour mobile via `IStorage` interface.

### Fonctionnalités

1. **Recherche de fichiers** : Retrouver les tickets associés à une transaction
2. **Déplacement** : Déplacer les fichiers quand la catégorie change
3. **Suppression** : Nettoyer les fichiers orphelins

### Pour Mobile

```python
# Abstraction requise
# shared/storage/istorage.py
class IStorage:
    def save(self, data: bytes, path: str) -> str: ...
    def load(self, path: str) -> bytes: ...

# Implémentations :
# - DesktopStorage (pathlib.Path)
# - CapacitorStorage (@capacitor/filesystem)
```

> 💡 En mobile, utiliser `@capacitor/filesystem` au lieu de chemins locaux

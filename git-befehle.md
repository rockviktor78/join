# Git Befehle - Projekt Join

## Branch umbenennen

### Lokalen Branch umbenennen

```bash
git branch -m feature/beispiel "feature/Sidebar&Header"
```

Dieser Befehl benennt den lokalen Branch von `feature/beispiel` zu `feature/Sidebar&Header` um.

**Wichtig:** Bei Sonderzeichen wie `&`, `|`, `;`, etc. im Branch-Namen müssen Anführungszeichen verwendet werden!

### Branch mit Main aktualisieren

```bash
git fetch origin
git rebase origin/main
```

- `git fetch origin`: Holt die neuesten Änderungen vom Remote-Repository
- `git rebase origin/main`: Integriert die Änderungen vom main-Branch in den aktuellen Branch

### Neuen Branch zu GitHub pushen

```bash
git push -u origin "feature/Sidebar&Header"
```

- Pusht den umbenannten Branch `feature/Sidebar&Header` zu GitHub
- `-u` setzt den Remote-Tracking-Branch (upstream)
- **Wichtig:** Bei Branch-Namen mit Sonderzeichen auch beim Pushen Anführungszeichen verwenden!

### Branch löschen

#### Nur auf GitHub löschen

```bash
git push origin --delete feature/contacts
```

Löscht den Branch `feature/contacts` vom Remote-Repository (GitHub).

#### Nur lokal löschen

```bash
git branch -d feature/name      # Sicheres Löschen (nur wenn gemerged)
git branch -D feature/name      # Erzwungenes Löschen
```

#### Lokal und auf GitHub löschen

```bash
git branch -D feature/name                  # Lokal löschen
git push origin --delete feature/name       # Auf GitHub löschen
```

**Hinweis:** Bei `git branch -m` wird der alte Branch-Name lokal automatisch ersetzt, nicht kopiert!

## Übersicht der durchgeführten Schritte

1. Branch lokal von `feature/contacts` zu `feature/viktor` umbenannt
2. Branch mit den neuesten Änderungen von `main` aktualisiert
3. Branch `feature/viktor` zu GitHub gepusht
4. Alten Branch `feature/contacts` auf GitHub gelöscht
5. Branch lokal von `feature/viktor` zu `feature/Sidebar&Header` umbenannt (mit Anführungszeichen wegen `&`)
6. Branch `feature/Sidebar&Header` zu GitHub gepusht
7. Alten Branch `feature/viktor` auf GitHub gelöscht

## Nützliche Git Befehle

### Status prüfen

```bash
git status
```

Zeigt den aktuellen Status des Working Directory und Staging Area.

### Branches anzeigen

```bash
git branch          # Lokale Branches
git branch -r       # Remote Branches
git branch -a       # Alle Branches
```

### Branch wechseln

```bash
git checkout <branch-name>
# oder
git switch <branch-name>
```

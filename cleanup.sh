#!/bin/bash
#
# Dead Code Cleanup Script
# Project: Join - Kanban Management Tool
# Date: 2026-02-06
# 
# USAGE:
#   ./cleanup.sh [phase]
#   
#   Phases:
#     bugs       - Fix critical bugs (Phase 1)
#     dead       - Remove dead files (Phase 2)
#     functions  - Remove unused functions (Phase 4)
#     all        - Execute all phases
#

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARCHIVE_DIR=".archive/cleanup-$(date +%Y-%m-%d)"
BACKUP_DIR="$ARCHIVE_DIR/backup"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
create_backup() {
    log_info "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
}

# Phase 1: Fix Critical Bugs
phase_bugs() {
    log_info "=== PHASE 1: Fixing Critical Bugs ==="
    
    # 1. Fix contacts.html script path typo
    log_info "Fixing contacts.html script path..."
    if grep -q 'cont`1acts\.js' pages/contacts.html; then
        cp pages/contacts.html "$BACKUP_DIR/contacts.html.bak"
        sed -i 's/cont`1acts\.js/contacts.js/' pages/contacts.html
        log_info "✓ Fixed: cont\`1acts.js → contacts.js"
    else
        log_warn "contacts.html already fixed or pattern not found"
    fi
    
    # 2. Fix index.html CSS class syntax error
    log_info "Fixing index.html CSS syntax..."
    if grep -q 'class="\.' index.html; then
        cp index.html "$BACKUP_DIR/index.html.bak"
        sed -i 's/class="\./class="/' index.html
        log_info "✓ Fixed: class=\". → class=\""
    else
        log_warn "index.html CSS syntax already fixed"
    fi
    
    # 3. Fix index.html wrong paths (./html/ → pages/)
    log_info "Fixing index.html link paths..."
    if grep -q '\./html/' index.html; then
        sed -i 's|\./html/|pages/|g' index.html
        log_info "✓ Fixed: ./html/ → pages/"
    else
        log_warn "index.html paths already fixed"
    fi
    
    log_info "Phase 1 complete!"
    log_warn "MANUAL ACTION REQUIRED: Implement confirmEditContact() in scripts/contacts.js"
}

# Phase 2: Remove Dead Files
phase_dead() {
    log_info "=== PHASE 2: Removing Dead Files ==="
    
    create_backup
    
    # Move dead files to archive
    DEAD_FILES=(
        "script.js"
        "add_task.css"
        "scripts/board.js"
        "scripts/summary.js"
        "scripts/add_task.js"
    )
    
    for file in "${DEAD_FILES[@]}"; do
        if [ -f "$file" ]; then
            log_info "Archiving: $file"
            mv "$file" "$ARCHIVE_DIR/"
        else
            log_warn "File not found: $file"
        fi
    done
    
    # Optional: Remove empty CSS if not needed for future features
    read -p "Remove empty board.css and summary.css? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        [ -f "styles/board.css" ] && mv "styles/board.css" "$ARCHIVE_DIR/"
        [ -f "styles/summary.css" ] && mv "styles/summary.css" "$ARCHIVE_DIR/"
        log_info "✓ Empty CSS files archived"
        
        # Remove from HTML
        log_info "Removing CSS references from HTML..."
        sed -i '/board\.css/d' pages/board.html
        sed -i '/summary\.css/d' pages/summary.html
    fi
    
    log_info "Phase 2 complete! Files archived in: $ARCHIVE_DIR"
}

# Phase 4: Remove Unused Functions
phase_functions() {
    log_info "=== PHASE 4: Removing Unused Functions ==="
    
    create_backup
    
    # Backup contacts.js
    cp scripts/contacts.js "$BACKUP_DIR/contacts.js.bak"
    
    log_info "Removing confirmAddNewContact()..."
    # Remove function (lines 110-115 approximately)
    sed -i '/^function confirmAddNewContact/,/^}$/d' scripts/contacts.js
    
    log_info "Removing showSuccessMessage()..."
    # Remove function (lines 210-212 approximately)
    sed -i '/^function showSuccessMessage/,/^}$/d' scripts/contacts.js
    
    log_info "Phase 4 complete!"
    log_info "Backup saved: $BACKUP_DIR/contacts.js.bak"
}

# Show help
show_help() {
    cat << EOF
Dead Code Cleanup Script

USAGE:
  ./cleanup.sh [PHASE]

PHASES:
  bugs       - Fix critical bugs (RECOMMENDED FIRST!)
  dead       - Remove dead files
  functions  - Remove unused functions
  all        - Execute all phases sequentially

EXAMPLES:
  ./cleanup.sh bugs       # Fix bugs only
  ./cleanup.sh all        # Full cleanup

SAFETY:
  - All operations create backups in .archive/cleanup-DATE/
  - Original files are moved, not deleted
  - You can restore from backups if needed

For more details, see: DEAD_CODE_ANALYSIS.md
EOF
}

# Main execution
main() {
    cd "$PROJECT_ROOT"
    
    case "${1:-}" in
        bugs)
            phase_bugs
            ;;
        dead)
            phase_dead
            ;;
        functions)
            phase_functions
            ;;
        all)
            log_info "Starting full cleanup..."
            phase_bugs
            echo ""
            phase_dead
            echo ""
            phase_functions
            log_info "All phases complete!"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Invalid phase: ${1:-none}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"

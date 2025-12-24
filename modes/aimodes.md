# AI MOD YÖNLENDİRME

Bu dosya, projedeki görevlere göre hangi modların seçileceğini belirleyen matristir.

## MOD SEÇİM KURALLARI

### 1. Karmaşık Görevler / Planlama
- **Modlar:** `UltraThink`, `ArchitectMode`, `ContextKeeper`
- **Tetikleyici:** "karmaşık", "plan yap", "tasarla", "mimari", "büyük özellik", "analiz et"

### 2. Kod Yazma
- **Modlar:** `AgentGuard`, `FileAware`, `StepByStep`
- **Tetikleyici:** "oluştur", "yaz", "implement", "geliştir"
- **ZORUNLU:** `AgentGuard` + `FileAware`

### 3. Hata Düzeltme
- **Modlar:** `DebugMaster`, `TestFirst`
- **Tetikleyici:** "bug", "hata", "çalışmıyor", "fix"

### 4. Refaktör
- **Modlar:** `RefactorSafe`, `MultiFileSync`, `TestFirst`
- **Tetikleyici:** "refactor", "optimize", "temizle"

### 5. Terminal İşlemleri
- **Modlar:** `SafeExecutor`
- **Tetikleyici:** "komut", "çalıştır", "install", "script"
- **ZORUNLU:** Her terminal komutunda.

### 6. Dokümantasyon
- **Modlar:** `DocuGen`
- **Tetikleyici:** "dokümante et", "README", "açıklama ekle"

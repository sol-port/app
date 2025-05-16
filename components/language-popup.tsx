"use client"
import { Popup } from "@/components/ui/popup"
import { useLanguage } from "@/context/language-context"

interface LanguageOption {
  code: string
  name: string
}

interface LanguagePopupProps {
  isOpen: boolean
  onClose: () => void
  onSelectLanguage: (code: string) => void
  currentLanguage: string
}

const languages: LanguageOption[] = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
]

export function LanguagePopup({ isOpen, onClose, onSelectLanguage, currentLanguage }: LanguagePopupProps) {
  const { t } = useLanguage()

  return (
    <Popup isOpen={isOpen} onClose={onClose} className="w-48">
      <div className="space-y-1">
        <div className="text-sm font-medium mb-2 text-solport-textSecondary">{t("header.selectLanguage")}</div>
        {languages.map((language) => (
          <button
            key={language.code}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              currentLanguage === language.code
                ? "bg-solport-accent text-white"
                : "hover:bg-[#273344] text-solport-text"
            }`}
            onClick={() => {
              onSelectLanguage(language.code)
              onClose()
            }}
          >
            {language.name}
          </button>
        ))}
      </div>
    </Popup>
  )
}

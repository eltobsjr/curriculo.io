"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useResume } from "@/lib/use-resume";
import { useUiPrefs } from "@/lib/use-ui-prefs";
import { ACCENT_PRESETS, FONT_OPTIONS } from "@/lib/resume-schema";
import { LANGUAGES } from "@/lib/i18n";
import { useT, UI_LANGUAGES } from "@/lib/i18n-ui";
import { getTemplate } from "@/templates/registry";
import { EditorPanel } from "@/components/EditorPanel";
import { GuidedEditor } from "@/components/GuidedEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { TemplateGallery } from "@/components/TemplateGallery";
import { QualityPanel } from "@/components/QualityPanel";
import { Onboarding } from "@/components/Onboarding";
import { ImportExport } from "@/components/ImportExport";
import { SupportModal } from "@/components/SupportModal";
import { PostDownloadModal } from "@/components/PostDownloadModal";
import { Btn } from "@/components/ui";

export default function Home() {
  const { data, settings, content, availableLangs, isTranslating, updateData, updateSettings, switchLanguage, resetSample, clearAll, loadDocument } =
    useResume();
  const { prefs, hydrated, set, incFont, decFont } = useUiPrefs();
  const { t, lang: uiLang, setLang: setUiLang } = useT();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editar" | "ver">("editar");
  const [supportOpen, setSupportOpen] = useState(false);
  const [postDownloadOpen, setPostDownloadOpen] = useState(false);
  const current = getTemplate(settings.templateId);

  const print = () => window.print();

  // Após o usuário baixar/imprimir, abrir a vitrine de vagas (momento de conversão).
  useEffect(() => {
    const onAfterPrint = () => setPostDownloadOpen(true);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);
  const showOnboarding = hydrated && !prefs.onboardingDone;

  return (
    <>
      <div className="app-shell flex h-screen flex-col">
      {/* ===== Barra superior ===== */}
      <header className="no-print ui-scaled z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Currículo.io" width={32} height={32} className="h-8 w-8" priority />
            <span className="text-base font-bold text-slate-800">
              Currículo<span className="text-indigo-600">.io</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Acessibilidade: tamanho da fonte */}
            <div className="flex items-center rounded-lg border border-slate-300" title={t("header.fontSize")}>
              <button onClick={decFont} aria-label={t("header.decreaseFont")} className="px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">
                A−
              </button>
              <span className="w-9 text-center text-[11px] text-slate-400">{Math.round(prefs.fontScale * 100)}%</span>
              <button onClick={incFont} aria-label={t("header.increaseFont")} className="px-2 py-1.5 text-base font-bold text-slate-600 hover:bg-slate-100">
                A+
              </button>
            </div>

            {/* Cores de destaque */}
            <div className="hidden items-center gap-1 md:flex">
              {ACCENT_PRESETS.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => updateSettings({ accentColor: c })}
                  aria-label={`Cor ${c}`}
                  className={`h-6 w-6 rounded-full ring-2 transition ${
                    settings.accentColor === c ? "ring-slate-400" : "ring-transparent hover:ring-slate-200"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
                aria-label="Cor personalizada"
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </div>

            {/* Fonte do currículo */}
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value as typeof settings.fontFamily })}
              aria-label={t("header.resumeFont")}
              className="hidden rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-700 sm:block"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Idioma da interface */}
            <select
              value={uiLang}
              onChange={(e) => setUiLang(e.target.value as typeof uiLang)}
              aria-label={t("header.uiLanguage")}
              title={t("header.uiLanguage")}
              className="rounded-lg border border-slate-300 px-1.5 py-1.5 text-sm text-slate-700"
            >
              {UI_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.code.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Idioma do currículo */}
            <div className="flex items-center rounded-lg border border-slate-300" title={t("header.resumeLanguage")}>
              {LANGUAGES.map((l) => {
                const isActive = settings.language === l.code;
                const hasContent = availableLangs.includes(l.code);
                const isLoading = isTranslating && isActive;
                return (
                  <button
                    key={l.code}
                    onClick={() => switchLanguage(l.code)}
                    disabled={isTranslating}
                    aria-label={`${t("header.resumeLanguage")}: ${l.label}`}
                    title={hasContent ? l.label : `${l.label} — ${t("header.translateAuto")}`}
                    className={`relative px-2 py-1.5 text-sm transition ${
                      isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    } ${hasContent || isActive ? "" : "opacity-50"} first:rounded-l-md last:rounded-r-md`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      l.flag
                    )}
                  </button>
                );
              })}
            </div>

            <Btn variant="outline" onClick={() => setGalleryOpen(true)}>
              🎨 <span className="hidden sm:inline">{t("header.templates")}</span>
            </Btn>
            <button
              onClick={() => setSupportOpen(true)}
              className="rounded-lg px-2 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50"
              title={t("header.support")}
            >
              ❤️ <span className="hidden md:inline">{t("header.support")}</span>
            </button>
            <Btn variant="primary" onClick={print}>
              ⬇ <span className="hidden sm:inline">{t("header.downloadPdf")}</span>
            </Btn>
          </div>
        </div>

        {/* Banner de confiança */}
        <div className="flex items-center justify-center gap-x-4 gap-y-0.5 overflow-x-auto whitespace-nowrap border-t border-slate-100 bg-emerald-50/60 px-3 py-1 text-[11px] font-medium text-emerald-700">
          <span>✓ {t("banner.free")}</span>
          <span>✓ {t("banner.noSignup")}</span>
          <span>✓ {t("banner.noWatermark")}</span>
          <span className="hidden sm:inline">✓ {t("banner.dataLocal")}</span>
        </div>
      </header>

      {/* ===== Abas (apenas no celular) ===== */}
      <div className="no-print flex border-b border-slate-200 bg-white lg:hidden">
        {(["editar", "ver"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium ${
              mobileTab === tab ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
            }`}
          >
            {tab === "editar" ? t("tabs.edit") : t("tabs.preview")}
          </button>
        ))}
      </div>

      {/* ===== Corpo ===== */}
      <div className="flex min-h-0 flex-1">
        {/* Editor */}
        <div
          className={`ui-scaled no-print thin-scroll w-full overflow-y-auto border-r border-slate-200 bg-slate-50 p-4 lg:flex lg:max-w-md lg:flex-col ${
            mobileTab === "editar" ? "flex flex-col" : "hidden"
          }`}
        >
          {/* Topo do editor: qualidade + modo */}
          <div className="mb-4 space-y-3">
            <QualityPanel data={data} />
            <div className="flex items-center justify-between">
              <div className="flex rounded-lg border border-slate-300 p-0.5 text-xs">
                <button
                  onClick={() => set({ mode: "guiado" })}
                  className={`rounded-md px-3 py-1.5 font-medium ${prefs.mode === "guiado" ? "bg-indigo-600 text-white" : "text-slate-600"}`}
                >
                  {t("editor.guided")}
                </button>
                <button
                  onClick={() => set({ mode: "avancado" })}
                  className={`rounded-md px-3 py-1.5 font-medium ${prefs.mode === "avancado" ? "bg-indigo-600 text-white" : "text-slate-600"}`}
                >
                  {t("editor.advanced")}
                </button>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <ImportExport
                  content={content}
                  settings={settings}
                  onImport={loadDocument}
                  onExample={resetSample}
                  onClear={clearAll}
                />
              </div>
            </div>
          </div>

          {/* Editor conforme o modo */}
          <div className="flex-1">
            {prefs.mode === "guiado" ? (
              <GuidedEditor
                data={data}
                update={updateData}
                showPhoto={current.supportsPhoto}
                onFinish={() => setMobileTab("ver")}
              />
            ) : (
              <EditorPanel data={data} update={updateData} showPhoto={current.supportsPhoto} />
            )}
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-400">{t("editor.autosaved")}</p>
        </div>

        {/* Preview */}
        <div
          className={`thin-scroll flex-1 overflow-y-auto bg-slate-200/70 p-4 sm:p-6 lg:block ${
            mobileTab === "ver" ? "block" : "hidden"
          }`}
        >
          <div className="mx-auto max-w-[794px]">
            <ResumePreview data={data} settings={settings} />
          </div>
        </div>
      </div>

      {/* ===== Modais ===== */}
      <TemplateGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        data={data}
        settings={settings}
        onSelect={(templateId) => updateSettings({ templateId })}
      />

      {showOnboarding && (
        <Onboarding
          onChoose={({ mode, start }) => {
            if (start === "exemplo") resetSample();
            else clearAll();
            set({ mode, onboardingDone: true });
          }}
        />
      )}

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />

      <PostDownloadModal
        open={postDownloadOpen}
        onClose={() => setPostDownloadOpen(false)}
        onSupport={() => {
          setPostDownloadOpen(false);
          setSupportOpen(true);
        }}
      />
      </div>

      {/* ===== Área de impressão (renderizada só na impressão) ===== */}
      <div id="print-area">
        <ResumePreview data={data} settings={settings} printMode />
      </div>
    </>
  );
}

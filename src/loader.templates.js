// champs-core/loader.templates.js

// ===== Wine =====
export const loaderWine = `
  <div class="wine-loader text-center">
    <svg width="64" height="64" viewBox="0 0 64 64" aria-label="Carregando..." role="img" class="wine-glass">
      <path d="M16 4h32c0 10-8 18-16 18S16 14 16 4z" fill="#800020"/>
      <path d="M32 22c-8 0-16-8-16-18h32c0 10-8 18-16 18z" fill="none" stroke="#3a3a3a" stroke-width="2"/>
      <path d="M32 22v22" stroke="#3a3a3a" stroke-width="3"/>
      <path d="M22 44h20" stroke="#3a3a3a" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <div class="small mt-2">Carregando...</div>
  </div>
`;

// ===== Wine Animated =====
export const loaderWineAnimated = `
  <div class="champs-wine-animated" role="img" aria-label="Carregando">
    <svg viewBox="0 0 64 64" class="champs-wine-svg" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="champs-glass-clip" clipPathUnits="userSpaceOnUse">
          <path d="M16,6 h32 v22 c0,10 -8,18 -16,18 s-16,-8 -16,-18 z"></path>
        </clipPath>
      </defs>
      <g clip-path="url(#champs-glass-clip)">
        <rect class="champs-wine-fill" x="16" y="6" width="32" height="40"></rect>
      </g>
      <path d="M16,6 h32 v22 c0,10 -8,18 -16,18 s-16,-8 -16,-18 z"
            fill="none" stroke="currentColor" stroke-width="2"></path>
      <rect x="31" y="46" width="2" height="10" fill="currentColor" opacity=".6"></rect>
      <rect x="24" y="56" width="16" height="2" fill="currentColor" opacity=".6"></rect>
    </svg>
  </div>
`;

// ===== Minimal Dots =====
export const loaderMinimal = `
  <div class="dots-loader" aria-label="Carregando..." role="status">
    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
  </div>
`;

// ===== Cornetas =====
export const loaderCornetas = `
  <div class="champs-cornetas-min" role="img" aria-label="Carregando">
    <svg viewBox="0 0 120 60" class="cn-svg" aria-hidden="true">
      <path d="M12 34 h34 l20-10 v20 l-20-10 h-34 z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="76" cy="34" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
      <g class="cn-waves">
        <path d="M90 34 q10 -10 22 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="36" stroke-dashoffset="36"/>
        <path d="M90 34 q10  10 22 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="36" stroke-dashoffset="36"/>
        <path d="M92 34 q12   0 24 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="28" stroke-dashoffset="28"/>
      </g>
    </svg>
  </div>
`;

export const loaderCornetasMinimal = `
  <div class="champs-cornetas-ping" role="img" aria-label="Carregando">
    <svg viewBox="0 0 120 60" class="cn-svg" aria-hidden="true">
      <path d="M12 34 h34 l20-10 v20 l-20-10 h-34 z" fill="currentColor"/>
      <circle cx="76" cy="34" r="8" fill="currentColor" opacity=".25"/>
      <circle class="cn-pulse" cx="76" cy="34" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>
  </div>
`;

// ===== OrganizzeMe =====
export const loaderOrganizzeMe = `
  <div class="champs-org-book" role="img" aria-label="Carregando">
    <svg viewBox="0 0 120 84" class="org-svg" aria-hidden="true">
      <rect x="6" y="8" width="108" height="68" rx="8" fill="none" stroke="currentColor" stroke-width="3"/>
      <rect x="18" y="20" width="84" height="44" fill="currentColor" opacity=".12"/>
      <rect x="18" y="22" width="84" height="44" fill="currentColor" opacity=".12"/>
      <rect class="org-page" x="18" y="20" width="84" height="44" fill="currentColor" opacity=".55"/>
      <g opacity=".6" stroke="currentColor" stroke-width="2">
        <circle cx="30" cy="16" r="2" fill="currentColor"/><circle cx="44" cy="16" r="2" fill="currentColor"/>
        <circle cx="58" cy="16" r="2" fill="currentColor"/><circle cx="72" cy="16" r="2" fill="currentColor"/>
        <circle cx="86" cy="16" r="2" fill="currentColor"/>
      </g>
    </svg>
  </div>
`;

export const loaderOrganizzeMeMinimal = `
  <div class="champs-org-min" role="img" aria-label="Carregando">
    <svg viewBox="0 0 120 84" class="org-svg" aria-hidden="true">
      <rect x="10" y="12" width="100" height="60" rx="8" fill="none" stroke="currentColor" stroke-width="3"/>
      <g class="org-lines" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".7">
        <line x1="24" x2="96" y1="30" y2="30"/>
        <line x1="24" x2="96" y1="42" y2="42"/>
        <line x1="24" x2="96" y1="54" y2="54"/>
      </g>
      <rect class="org-sweep" x="18" y="22" width="84" height="44" rx="4" fill="currentColor" opacity=".08"/>
    </svg>
  </div>
`;

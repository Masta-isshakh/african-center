import { cn } from '@/lib/utils';

/**
 * Gold line elevation of a two-storey villa with a majlis wing — the hero's blueprint motif,
 * shown behind the content while the hero photo/video slots are empty.
 */
export function BlueprintVilla({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 960 520" fill="none" aria-hidden="true" className={cn('rtl:-scale-x-100', className)}>
      <g stroke="#C99A2E" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
        {/* ground + dimension line */}
        <path d="M20 440H940" strokeOpacity=".9" />
        <path d="M60 480H900M60 472v16M900 472v16M300 476v8M640 476v8" strokeOpacity=".45" />
        {/* boundary wall */}
        <path d="M20 440V392H118V440M842 440V392H940V440" strokeOpacity=".55" />
        {/* main block */}
        <path d="M160 440V214H640V440" />
        <path d="M148 214H652V196H148Z" />
        <path d="M160 330H640" strokeOpacity=".5" />
        {/* upper floor windows */}
        <path d="M196 250H276V312H196ZM316 250H396V312H316ZM524 250H604V312H524Z" strokeOpacity=".8" />
        <path d="M236 250V312M356 250V312M564 250V312" strokeOpacity=".35" />
        {/* mashrabiya screen */}
        <path d="M424 236H496V322H424Z" />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={`v${i}`} d={`M${433 + i * 9} 236V322`} strokeOpacity=".35" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <path key={`h${i}`} d={`M424 ${246 + i * 10}H496`} strokeOpacity=".35" />
        ))}
        {/* entrance arch + door */}
        <path d="M352 440V378C352 352 372 336 400 336C428 336 448 352 448 378V440" />
        <path d="M372 440V384C372 368 384 356 400 356C416 356 428 368 428 384V440M400 356V440" strokeOpacity=".55" />
        {/* ground floor windows */}
        <path d="M196 366H296V420H196ZM504 366H604V420H504Z" strokeOpacity=".8" />
        {/* majlis wing */}
        <path d="M640 440V300H820V440" />
        <path d="M632 300H828V286H632Z" />
        <path d="M672 336H712V420H672ZM748 336H788V420H748Z" strokeOpacity=".8" />
        <path d="M672 352C672 340 682 332 692 332C702 332 712 340 712 352M748 352C748 340 758 332 768 332C778 332 788 340 788 352" strokeOpacity=".45" />
        {/* parapet crenellation */}
        <path d="M160 196V184H200V196M240 196V184H280V196M320 196V184H360V196M440 196V184H480V196M520 196V184H560V196M600 196V184H640V196" strokeOpacity=".45" />
        {/* palm */}
        <path d="M880 440V330" strokeOpacity=".6" />
        <path d="M880 330C860 316 836 318 820 330M880 330C900 314 924 316 940 328M880 330C872 306 852 296 836 300M880 330C892 304 912 296 928 298M880 330C880 308 888 290 900 282" strokeOpacity=".6" />
        {/* section marker */}
        <circle cx="96" cy="140" r="22" strokeOpacity=".55" />
        <path d="M74 140H118M96 118V162" strokeOpacity=".35" />
        <path d="M118 140H160" strokeDasharray="4 6" strokeOpacity=".4" />
      </g>
    </svg>
  );
}

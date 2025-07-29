import { useEffect, useState } from 'react';

export function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // Проверяем Mac (включая Safari, Chrome, Firefox и другие браузеры на macOS)
    const isMacOS = /macintosh|macintel|mac os x/.test(userAgent);
    
    // Дополнительная проверка для iPad на macOS (если важно)
    const isMacLike = isMacOS || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    setIsMac(isMacLike);
  }, []);

  return isMac;
}
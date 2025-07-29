import { useEffect, useState } from 'react';

export function useSafariOrIOS() {
  const [isSafariOrIOS, setIsSafariOrIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    
    // Проверка на Safari (включая desktop Safari)
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    
    // Проверка на iOS (iPhone, iPad, iPod)
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Проверка на Safari в iOS 13+ (где user agent похож на desktop)
    const isIOS13Safari = isIOS && /Version\/[\d.]+.*Safari/.test(userAgent);
    
    setIsSafariOrIOS(isSafari || isIOS || isIOS13Safari);
  }, []);

  return isSafariOrIOS;
}
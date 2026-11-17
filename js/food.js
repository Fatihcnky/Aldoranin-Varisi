'use strict';
// ===== YEMEK ÇEŞİTLİLİĞİ =====
// Türler: tahıl, sebze, et (ağıl), av, meyve, balık, ekmek. Son 1.5 günde üretilen/yenen tür sayısı.
function fvMark(c){if(!S)return;if(!S.fv)S.fv={};S.fv[c]=S.t;}
function foodVar(){if(!S||!S.fv)return 0;let n=0;for(const k in S.fv)if(S.t-S.fv[k]<DAY*1.5)n++;return n;}
{const _od=onDay;onDay=function(){_od();if(!S.founded)return;if(foodVar()<=2)S.varLow=(S.varLow||0)+1;else S.varLow=Math.max(0,(S.varLow||0)-2);};}

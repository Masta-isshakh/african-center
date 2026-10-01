/** Search normalisation: lower-case, strip Arabic diacritics/tatweel, unify alef, taa marbuta and alef maqsura. */
export function normalizeForSearch(s: string) {
  return s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[آأإ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

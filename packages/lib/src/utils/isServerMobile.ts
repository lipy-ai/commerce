import MobileDetect from "mobile-detect";

export const getIsSsrMobile = (userAgentHeaderValue: any) => {
  const md = new MobileDetect(userAgentHeaderValue);
  return Boolean(md.mobile() || md.tablet());
};

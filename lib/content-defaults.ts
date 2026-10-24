import type { ContentKey } from './content-core';
import { MYTH_VIDEO, type ShowcaseVideoContent } from './creatives-video.ts';
import { DIVISION_PAGES, type DivisionPageContent } from './division-pages.ts';
import { generalFaq, type Qa } from './faq.ts';
import {
  ABOUT_PAGE,
  CAREERS_PAGE,
  CONTACT_PAGE,
  CREATIVES_PAGE,
  HOME,
  SUPPORT_PAGE,
  type AboutContent,
  type CareersContent,
  type ContactContent,
  type CreativesContent,
  type HomeContent,
  type SupportContent,
} from './page-content.ts';
import {
  AUDIENCE,
  COMPANY,
  DELIVERY_STEPS,
  DIVISIONS,
  ENGAGEMENTS,
  FOUNDER,
  HOME_QUOTE,
  PROMISES,
  SHOWCASE,
  services,
  type Company,
  type Division,
  type Founder,
  type Point,
  type Quote,
  type Service,
  type Showcase,
} from './site-data.ts';

/** What each content key holds: the same shapes the components render. */
export interface ContentMap {
  company: Company;
  home: HomeContent;
  quote: Quote;
  founder: Founder;
  divisions: Division[];
  showcase: Showcase[];
  services: Service[];
  audience: Point[];
  engagements: Point[];
  promises: Point[];
  steps: [string, string][];
  'faq:general': Qa[];
  'division:software': DivisionPageContent;
  'division:automation': DivisionPageContent;
  'division:ai': DivisionPageContent;
  'division:creatives': DivisionPageContent;
  'page:creatives': CreativesContent;
  'page:about': AboutContent;
  'page:support': SupportContent;
  'page:contact': ContactContent;
  'page:careers': CareersContent;
  'video:creatives': ShowcaseVideoContent;
}

/**
 * The built-in copy of every key: what `npm run content:seed` writes to web.content, and what the site shows when
 * the database can't be read. Plain JSON only (no functions), so the database copy has the same shape.
 */
export const CONTENT_DEFAULTS: { [K in ContentKey]: ContentMap[K] } = {
  company: COMPANY,
  home: HOME,
  quote: HOME_QUOTE,
  founder: FOUNDER,
  divisions: DIVISIONS,
  showcase: SHOWCASE,
  services,
  audience: AUDIENCE,
  engagements: ENGAGEMENTS,
  promises: PROMISES,
  steps: DELIVERY_STEPS,
  'faq:general': generalFaq(COMPANY.email, 'www.hitroo.com/contact'),
  'division:software': DIVISION_PAGES.software,
  'division:automation': DIVISION_PAGES.automation,
  'division:ai': DIVISION_PAGES.ai,
  'division:creatives': DIVISION_PAGES.creatives,
  'page:creatives': CREATIVES_PAGE,
  'page:about': ABOUT_PAGE,
  'page:support': SUPPORT_PAGE,
  'page:contact': CONTACT_PAGE,
  'page:careers': CAREERS_PAGE,
  'video:creatives': MYTH_VIDEO,
};

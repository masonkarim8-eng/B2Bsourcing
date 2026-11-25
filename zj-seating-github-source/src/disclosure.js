const modelTiers = {
  '9628H': 'teaser',
  '8412H-BK': 'dealer',
  '8413H-GR': 'dealer',
  '8415H-BK': 'dealer',
  '8417H-BK': 'dealer',
  'YKX-33053': 'dealer',
  'YKX-33090BR': 'dealer'
};

export const disclosureContent = {
  public: {
    tier: 'public',
    badge: 'PUBLIC CATALOG',
    action: 'Product page',
    request: 'Request this model',
    note: 'Published specifications are suitable for initial sourcing review. Confirm current materials, colors, availability, and packaging with sales.'
  },
  teaser: {
    tier: 'teaser',
    badge: 'FLAGSHIP PREVIEW',
    action: 'Preview design',
    request: 'Register buyer interest',
    note: 'A limited first look. Dimensions, construction, component details, loading data, and specification sheets are reserved for a controlled sales review.'
  },
  dealer: {
    tier: 'dealer',
    badge: 'DEALER DETAILS',
    action: 'Request specifications',
    request: 'Request dealer specifications',
    note: 'Detailed dimensions, MOQ, loading data, and documents are shared after a buyer and project review. No protected document download is represented in this concept.'
  }
};

export function getDisclosure(product) {
  return disclosureContent[modelTiers[product.model] || 'public'];
}

export function publicDescription(product) {
  const disclosure = getDisclosure(product);
  if (disclosure.tier === 'teaser') return 'A first look at ZJ Seating’s next premium executive direction, with a refined high-back silhouette and a coordinated finish story. Detailed design and engineering information remains available through a controlled buyer review.';
  if (disclosure.tier === 'dealer') return `${product.summary} Detailed specifications and commercial documents are available to qualified buyers through sales.`;
  return product.description;
}

export function publicSpecs(product) {
  const disclosure = getDisclosure(product);
  if (disclosure.tier !== 'public') return [
    ['Model', product.model],
    ['Category', product.label],
    ['Detailed specifications', disclosure.tier === 'teaser' ? 'Controlled preview' : 'Available through buyer review']
  ];
  return [
    ['Model', product.model],
    ['Category', product.label],
    ['Dimensions', product.dimensions],
    ['Minimum order', product.moq],
    ['Container loading', product.loading]
  ].filter(([, value]) => value);
}

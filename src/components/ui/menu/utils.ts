import subscription from './list-of-smartdata-available.json';

export async function formatSmartdata(data: any, client: any, userProfile: string[]) {
  const result: any = [];
  if (!data) return [];

  const smartdatas = data?.accessible_smartdata;
  if (userProfile.includes('admin')) {
    // Admin profile
    result.push(
      'economy_growth',
      'gdp_leading',
      'gdp_nowcast',
      'inflation',
      'employment',
      'risk_on_off',
      'dynamic_quadrant',
      'agriculture',
      'drought_country',
      'pollution',
      'industrial_production',
      'qmn',
      'trade_international',
      'trade_commodity',
      'trade_automotive',
      'trade_congestion',
      'consumption',
      'air_traffic',
      'international_tourism',
      'country_risk',
      'food_anxiety',
      'industrial_activity',
      'regional_trade',
      'meteo_demand',
      'electricity_production',
      'lng_inventory'
    );
    return subscription;
  }
  if (userProfile.includes('jera')) {
    // JERA profile
    result.push(
      'industrial_activity',
      'regional_trade',
      'meteo_demand',
      'electricity_production',
      'lng_inventory'
    );
  }
  if (userProfile.includes('base_user')) {
    for (const smartdata of smartdatas) {
      // condition if gdp need to get listelement for leading and nowcast
      // then replace gdp with gdp_leading and gdp_nowcast and economy if leading and nowcast is available
      if (smartdata === 'gdp') {
        // make graphql request to get list of listelement for gdp
        const res = await client.request(`
        query GDPApproachList {
          listElements(input: { q: gdp }) {
              data {
                  ... on modelTypeGdp {
                      approach
                  }
              }
          }
      }
    `);
        if (res?.listElements?.data?.length > 0) {
          const gdpApproach = res?.listElements?.data.map((item: any) => item.approach);
          if (gdpApproach.includes('leading')) {
            result.push('gdp_leading');
          }
          if (gdpApproach.includes('nowcast')) {
            result.push('gdp_nowcast');
          }
          if (gdpApproach.includes('leading') && gdpApproach.includes('nowcast')) {
            result.push('economy_growth');
          }
        }
        // condition if trade_commodity need to get listelement for trade_commodity to check if it includes auto or any of the possible commodities
      } else if (smartdata === 'trade_commodity') {
        if (userProfile.includes('jera')) {
          continue;
        } else {
          const res = await client.request(`
            query CommodityList{
              listElements(input: { q: trade_commodity }) {
                  data {
                      ... on modelTypeTradeCommodity {
                          commodity
                      }
                  }
              }
            }
          `);

          if (res?.listElements?.data?.length > 0) {
            const possibleCommodities = [
              'bauxite',
              'coal',
              'copper',
              'crude',
              'iron',
              'lng',
              'oil',
            ];
            const tradeCommodityApproach = res?.listElements?.data.map(
              (item: any) => item.commodity
            );
            if (tradeCommodityApproach.includes('auto')) {
              result.push('trade_automotive');
            }
            // if trade_commodity includes one of the possible commodities then add trade_commodity
            if (tradeCommodityApproach.some((item: any) => possibleCommodities.includes(item))) {
              result.push('trade_commodity');
            }
          }
        }
      } else {
        result.push(smartdata);
      }
    }
  }

  for (const category in subscription) {
    const setOfSmartdata = subscription[category as keyof typeof subscription];
    setOfSmartdata.map((item: any) => {
      if (!result.includes(item.id)) {
        item.available = false;
      } else {
        item.available = true;
      }
    });
  }

  return subscription;
}

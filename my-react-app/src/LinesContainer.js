import { number } from "prop-types";
import React, {useEffect, useState} from "react";

const LinesContainer = ({selectedCount}) => {
  const [ lineValues, setLineValues] = useState([]);
  const [ planRecommendations, setPlanRecommendations] = useState([])
  const [ featureItems, setFeatureItems] = useState([])
  const [ securityItems, setSecurityItems] = useState([])

  useEffect(()=> {
    const parseData = (key) => {
      try {
        const item = sessionStorage.getItem(key);
        if(!item) return [];
        const parsed = JSON.parse(item);
        if((key === 'selectedFeatureItems' || key === 'selectedSecurityItems') && Array.isArray(parsed)){
          return parsed.filter(item => item.isSelected)
          .map(item => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(item.recoVerbiage, 'text/html');
            const h3 = doc.querySelector('h3')?.textContent || '';
            return {
              noOfLines: item.noOfLines,
              title: h3
            }
          })
        } 
        if(Array.isArray(parsed)) {
          return parsed
        } else if(typeof parsed === 'object' && parsed !== null) {
            return Object.entries(parsed);
        }
        return [];
      } catch (error){
        return []
      }
    }
    setFeatureItems(parseData('selectedFeatureItems'));
    setLineValues(parseData('lineValues'));
    setSecurityItems(parseData('selectedSecurityItems'));
    setPlanRecommendations(parseData('planRecommendations'));

  }, []);
  return (
    <div style={{border:'1px solid #ccc', padding:'10px'}}>
      {lineValues && lineValues.length > 0 && (

      <><h4>Line Values</h4><ul>
          {lineValues?.map(([type, count], i) => (
            type === 'MD:SMART_PHONE' && (
              <li key={i}><strong>Smart Phone : </strong>({selectedCount || 0} / {count})</li>
              )
          ))}
        </ul></>
      )}
      {/* {planRecommendations && planRecommendations.length > 0 && (

      <><h4>Plan Recommendations</h4><ul>
          {planRecommendations?.map((plan, i) => (
            <li key={i}>
              <div><strong>DeviceType:</strong>{plan.deviceType}</div>
              <div><strong>Number of Lines:</strong>{plan.numberOfLines}</div>
              <div><strong>Plan Addons:</strong>{plan.planAddOnRecos?.join(', ') || 'None'}</div>
            </li>

          ))}
        </ul></>
      )}
      {featureItems && featureItems.length > 0 && (

      <><h4>Feature Items</h4><ul>
          {featureItems?.map((feature, i) => (
            <li key={i}><strong>{feature.title} : </strong>{feature.noOfLines}</li>
          ))}
        </ul></>
      )}
      {securityItems && securityItems.length > 0 && (
      
      <><h4>Security Items</h4><ul>
          {securityItems?.map((item, i) => (
            <li key={i}><strong>{item.title} : </strong>{item.noOfLines}</li>
          ))}
        </ul></>
      )} */}
    </div>
  )
}
export default LinesContainer;
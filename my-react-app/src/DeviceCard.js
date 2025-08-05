
import { CardActionArea, ButtonGroup, CardMedia, Link } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Button } from '@vds/buttons'
import styled from 'styled-components'
import { useEffect, useMemo, useState } from 'react'
// import Icon from '@vds/icons'
import { PhoneAndroidOutlined } from '@mui/icons-material'
import _ from 'lodash'
import { getDeviceVariants } from '../../../api/cartApis'

const CAPACITY_ORDER = [
  '32 GB',
  '64 GB',
  '128 GB',
  '256 GB',
  '512 GB',
  '1 TB',
  '2 TB',
]

const getCurrentProductData = (params) => {
  const {
    data,
    groupedByColor,
    selectedColor = '',
    selectedStorage = '',
  } = params

  const productObj =
    groupedByColor?.[selectedColor]?.find(
      (product) => product.Capacity === selectedStorage
    ) ?? {}

  const variationNotSelected = _.isEmpty(productObj)

  // Based on term we need to get some values
  const currentTerm = data?.DpTerms[0]?.Term
  const termObj =
    productObj?.DpTerms?.find((item) => item?.Term === currentTerm) ?? {}

  return {
    deviceBrand: variationNotSelected
      ? data?.Brand
      : productObj?.SkuDisplayName,
    deviceName: variationNotSelected ? data?.ProductDisplayName : '',
    deviceId: variationNotSelected ? data?.Sku : productObj?.Sku,
    remainingMonthPrice: variationNotSelected
      ? data?.DpTerms[0]?.DpRemainingMonthPrice
      : termObj?.DpRemainingMonthPrice,
    firstMonthPrice: variationNotSelected
      ? data?.DpTerms[0]?.DpFirstMonthPrice
      : termObj?.DpFirstMonthPrice,
    retailPrice: variationNotSelected
      ? data?.FullRetailPrice
      : productObj?.FullRetailPrice,
    term: variationNotSelected ? currentTerm : termObj?.Term,
    selectedColor,
    selectedStorage,
    selectedImage: variationNotSelected
      ? data?.ImageUrl?.Small
      : productObj?.ImageUrl?.Small,
  }
}

const getOrderedByCapacityData = (colorMapping = {}) => {
  const tempColorMapping = _.cloneDeep(colorMapping)
  const capacityRank = CAPACITY_ORDER.reduce((acc, capacity, index) => {
    acc[capacity] = index
    return acc
  }, {})

  Object.keys(tempColorMapping).forEach((key) => {
    tempColorMapping[key]?.length &&
      tempColorMapping[key].sort(
        (a, b) => capacityRank[a.Capacity] - capacityRank[b.Capacity]
      )
  })

  return tempColorMapping
}

const StyledButton = styled(Button)`
  width: 15px;
  height: 15px;
  border-radius: 50% !important;
  min-width: 0 !important;
  padding: 0;
  border: none;
`
const StyledButtonGroup = styled(ButtonGroup)`
  gap: 10px;
  margin-top: 15px;
  box-shadow: none !important;
`
const StyledCard = styled(Card)`
  & {
    border: 1px solid #cccccc;
    height: 100%;
    min-height: 180px;
    /* font-family: 'Verizon-NHG-eDS' !important; */
    font-family: 'Verizon-NHG-eTX' !important;
    /* letter-spacing: 0.5px; */

    &.selected {
      border: 2px solid black;
    }
    & .MuiButtonGroup-outlined {
      display: flex;
    }
    & .storageButton {
      background-color: none;
      background-color: transparent;
      color: #000;
      width: 48px;
      font-size: 10px;
      padding: 0;
      border-radius: 3px;
      min-width: 48px;
      & span {
        text-align: left;
        text-overflow: none;
        padding: 0;
      }
    }
  }
  .p-1 {
    padding: 2px;
  }
  & .card-content {
    display: flex !important;
    flex-flow: column nowrap;
    gap: 12px;
    justify-content: space-between;
    height: 100%;

    .text-white {
      color: #ffffff !important;
    }
    & .title {
      letter-spacing: 0.3px;
      font-family: 'Verizon-NHG-eTX';

      font-size: 21px;
      line-height: 1.3;
      font-weight: bold;

      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    & .cost {
      font-size: 27px;
      line-height: 1.125;
      font-weight: bold;
      margin-bottom: 8px;
      margin-top: auto;
    }
  }
  .displayName {
    font-size: 17px;
    font-weight: 600;
  }
`
const DeviceCard = ({ device, isSelected, selectDevice }) => {
  console.log(isSelected, 'isSelected')
  const data = device;
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [groupedByColor, setGroupedByColor] = useState(null)
  const [skuMapping, setSkuMapping] = useState([])
  const [imageError, setImageError] = useState(false)
  const [selected, setSelected] = useState(false)
  const currentSelectedProduct = useMemo(() => {
    // If we have already selected this product then return the selected Recomm device object
    // if (selected && _.isEmpty(selectedColor) && _.isEmpty(selectedStorage)) {
    //   return selectedRecommDevice
    // }

    // Usual flow where we need updated data based on storage and color selections
    return getCurrentProductData({
      data,
      groupedByColor,
      selectedColor,
      selectedStorage,
    })
  }, [
    device,
    groupedByColor,
    selectedColor,
    selectedStorage,
  ])
  const handleColorChange = (colorOptions) => {
    setSelectedColor(colorOptions)
    // Check if Capacity for that color is available or not
    const capacityPresent = groupedByColor[colorOptions]?.some(
      (product) => product?.Capacity === selectedStorage
    )
    if (!capacityPresent) {
      setSelectedStorage(groupedByColor?.[colorOptions]?.[0].Capacity)
    }
  }

  const handleStorageChange = (storage) => {
    setSelectedStorage(storage)
  }
  const staticDeviceVariantresponse = {
    "Status": "SUCCESS",
    "Products": [
      {
        "ProductId": null,
        "Sku": "SMF766UDBEV",
        "SkuDisplayName": "Samsung Galaxy Z Flip7 512GB in Blue Shadow",
        "Capacity": "512 GB",
        "Colour": "#3B5B8A",
        "ImageUrl": {
          "Small": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-blue-shadow-smf766udbv-smf766udbev",
          "Medium": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-blue-shadow-smf766udbv-smf766udbev?$device-med$",
          "Large": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-blue-shadow-smf766udbv-smf766udbev?$device-lg$"
        },
        "OneYrPrice": 1219.99,
        "TwoYrPrice": 749.99,
        "ThreeYrPrice": null,
        "FullRetailPrice": 1219.99,
        "QuantityAvailable": 741,
        "DpTerms": [
          {
            "Term": 36,
            "DpFirstMonthPrice": 34.19,
            "DpRemainingMonthPrice": 33.88
          }
        ]
      },
      {
        "ProductId": null,
        "Sku": "SMF766UZKV",
        "SkuDisplayName": "Samsung Galaxy Z Flip7 256GB in Jetblack",
        "Capacity": "256 GB",
        "Colour": "#4A4A4D",
        "ImageUrl": {
          "Small": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-jetblack-smf766uzkv-smf766uzkev",
          "Medium": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-jetblack-smf766uzkv-smf766uzkev?$device-med$",
          "Large": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-jetblack-smf766uzkv-smf766uzkev?$device-lg$"
        },
        "OneYrPrice": 1099.99,
        "TwoYrPrice": 649.99,
        "ThreeYrPrice": null,
        "FullRetailPrice": 1099.99,
        "QuantityAvailable": 430,
        "DpTerms": [
          {
            "Term": 36,
            "DpFirstMonthPrice": 30.74,
            "DpRemainingMonthPrice": 30.55
          }
        ]
      },
      {
        "ProductId": null,
        "Sku": "SMF766UDBV",
        "SkuDisplayName": "Samsung Galaxy Z Flip7 256GB in Blue Shadow",
        "Capacity": "256 GB",
        "Colour": "#3B5B8A",
        "ImageUrl": {
          "Small": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-blue-shadow-smf766udbv-smf766udbev",
          "Medium": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-blue-shadow-smf766udbv-smf766udbev?$device-med$",
          "Large": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-blue-shadow-smf766udbv-smf766udbev?$device-lg$"
        },
        "OneYrPrice": 1099.99,
        "TwoYrPrice": 649.99,
        "ThreeYrPrice": null,
        "FullRetailPrice": 1099.99,
        "QuantityAvailable": 1116,
        "DpTerms": [
          {
            "Term": 36,
            "DpFirstMonthPrice": 30.74,
            "DpRemainingMonthPrice": 30.55
          }
        ]
      },
      {
        "ProductId": null,
        "Sku": "SMF766UZRV",
        "SkuDisplayName": "Samsung Galaxy Z Flip7 256GB in Coralred",
        "Capacity": "256 GB",
        "Colour": "#EE6779",
        "ImageUrl": {
          "Small": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-coralred-smf766uzrv-smf766uzrev",
          "Medium": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-coralred-smf766uzrv-smf766uzrev?$device-med$",
          "Large": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-coralred-smf766uzrv-smf766uzrev?$device-lg$"
        },
        "OneYrPrice": 1099.99,
        "TwoYrPrice": 649.99,
        "ThreeYrPrice": null,
        "FullRetailPrice": 1099.99,
        "QuantityAvailable": 599,
        "DpTerms": [
          {
            "Term": 36,
            "DpFirstMonthPrice": 30.74,
            "DpRemainingMonthPrice": 30.55
          }
        ]
      },
      {
        "ProductId": null,
        "Sku": "SMF766UZREV",
        "SkuDisplayName": "Samsung Galaxy Z Flip7 512GB in Coralred",
        "Capacity": "512 GB",
        "Colour": "#EE6779",
        "ImageUrl": {
          "Small": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-coralred-smf766uzrv-smf766uzrev",
          "Medium": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-coralred-smf766uzrv-smf766uzrev?$device-med$",
          "Large": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-coralred-smf766uzrv-smf766uzrev?$device-lg$"
        },
        "OneYrPrice": 1219.99,
        "TwoYrPrice": 749.99,
        "ThreeYrPrice": null,
        "FullRetailPrice": 1219.99,
        "QuantityAvailable": 502,
        "DpTerms": [
          {
            "Term": 36,
            "DpFirstMonthPrice": 34.19,
            "DpRemainingMonthPrice": 33.88
          }
        ]
      },
      {
        "ProductId": null,
        "Sku": "SMF766UZKEV",
        "SkuDisplayName": "Samsung Galaxy Z Flip7 512GB in Jetblack",
        "Capacity": "512 GB",
        "Colour": "#4A4A4D",
        "ImageUrl": {
          "Small": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-jetblack-smf766uzkv-smf766uzkev",
          "Medium": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-jetblack-smf766uzkv-smf766uzkev?$device-med$",
          "Large": "https://ss7.vzw.com/is/image/VerizonWireless/samsung-galaxy-z-flip7-jetblack-smf766uzkv-smf766uzkev?$device-lg$"
        },
        "OneYrPrice": 1219.99,
        "TwoYrPrice": 749.99,
        "ThreeYrPrice": null,
        "FullRetailPrice": 1219.99,
        "QuantityAvailable": 602,
        "DpTerms": [
          {
            "Term": 36,
            "DpFirstMonthPrice": 34.19,
            "DpRemainingMonthPrice": 33.88
          }
        ]
      }
    ],
    "Errors": []
  }
  const fetchSkuList = (sku) => {
    //  setSelected(true);
    //  setSkuMapping(staticDeviceVariantresponse['Products']);
    const getDevices = async () => {
      const request = {
        "Sku": sku,
        "RetrieveAllVariants": true,
        "VzId": "KARRSU8"
      }
      const result = await getDeviceVariants(request);
      console.log("getDeviceVariants---------> Sunil", result)
      setSkuMapping(result?.data?.Products);
    }
    getDevices();

  }

  useEffect(() => {
    if (skuMapping?.length > 0) {
      const groupedByColorMapping = skuMapping.reduce((group, product) => {
        const color = product.Colour
        if (!group[color]) {
          group[color] = []
        }
        group[color].push(product)
        return group
      }, {})
      const groupedByColorData = getOrderedByCapacityData(groupedByColorMapping)
      setGroupedByColor(groupedByColorData)

      const selectedColor = Object.keys(groupedByColorData)[0]
      const selectedStorage = groupedByColorData[selectedColor][0].Capacity

      setSelectedColor(selectedColor)
      setSelectedStorage(selectedStorage)
    }
  }, [skuMapping])

  // useEffect(() => {
  //   if (selected) {
  //     fetchSkuList()
  //   }
  // }, [selected])

  return (
    <StyledCard
      className={isSelected ? 'selected' : ''}
      onClick={() => fetchSkuList(data?.Sku)}
    >
      <CardActionArea disableRipple className="h-full">
        <CardContent className="card-content">
          {isSelected && (
            <div className="absolute right-0 top-0 text-xs px-2 py-1 bg-black text-white rounded-tr-sm font-bold">
              {/* <Icon name="checkmark" size="16" color="white" /> &nbsp; */}
              Selected
            </div>
          )}
          <Card sx={{ width: 240, boxShadow: 0, maxWidth: '100%' }}>
            {currentSelectedProduct?.selectedImage && !imageError ? (
              <CardMedia
                component="img"
                // height="120"
                sx={{ width: 'auto', height: '90px' }}
                image={currentSelectedProduct?.selectedImage || ''}
                alt={device.SkuDisplayName || ''}
                onError={() => setImageError(true)}
              />
            ) : (

              <PhoneAndroidOutlined />
            )}

            <CardContent
              sx={{ p: 0, textAlign: 'left', pb: '12px !important' }}
            >
              <h3
                className="title mt-4"
                title={currentSelectedProduct?.deviceBrand}
              >
                {currentSelectedProduct?.deviceBrand}
              </h3>
              {currentSelectedProduct?.deviceName && (
                <p className="displayName">
                  {currentSelectedProduct?.deviceName}
                </p>
              )}
              {/* Selected Storage Display */}
              {groupedByColor && selectedStorage && (
                <p
                  className="text-xs mt-2"
                  style={{ fontSize: '12px', letterSpacing: '0.5px' }}
                >
                  {`(${selectedStorage})` || ''}
                </p>
              )}
              {/* Storage Options */}
              {groupedByColor && (
                <StyledButtonGroup
                  variant="outlined"
                  className="buttonAlign mt-4 ml-0.5 bg-transparent text-black text-xs flex-wrap"
                >
                  {groupedByColor[selectedColor]
                    ?.filter((item) => item.Capacity)
                    ?.map((item, index) => (
                      <Button
                        className="w-12 bg-transparent text-black text-xs storageButton p-0"
                        key={item.Capacity}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleStorageChange(item.Capacity)
                        }}
                        style={{
                          border:
                            selectedStorage === item.Capacity
                              ? '2px solid #000'
                              : '1px solid #666',
                        }}
                      >
                        {item.Capacity}
                      </Button>
                    ))}
                </StyledButtonGroup>
              )}
              {/* Color Options */}
              {groupedByColor && (
                <StyledButtonGroup
                  variant="contained"
                  color="primary"
                  className="buttonAlign mt-4 shadow-none"
                >
                  {Object.keys(groupedByColor).map((colorOption, index) => (
                    <div
                      key={colorOption}
                      className="p-1 rounded-xl"
                      style={{
                        border:
                          colorOption === selectedColor
                            ? '2px solid #000'
                            : '1px solid transparent',
                      }}
                    >
                      <StyledButton
                        key={colorOption}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleColorChange(colorOption)
                        }}
                        style={{ backgroundColor: colorOption }}
                        className={
                          selectedColor.color === colorOption
                            ? 'selected'
                            : ''
                        }
                      ></StyledButton>
                    </div>
                  ))}
                </StyledButtonGroup>
              )}
              <p className="flex font-bold text-xl items-baseline gap-3 mt-3">
                <span>${currentSelectedProduct?.remainingMonthPrice}/mo</span>
                {/* <span
                    className="font-normal text-base line-through"
                    style={{ color: '#999' }}
                  >
                    (${currentSelectedProduct?.firstMonthPrice}/mo)
                  </span> */}
              </p>
              <p className="mt-1 text-sm leading-tight">
                for {currentSelectedProduct?.term} months. <br /> Select
                unlimited Plan required.
              </p>
              {/* <p
                style={{
                  color: '#fff',
                  fontSize: '12px',
                  padding: '3px 21px 3px 7px',
                  backgroundColor: '#008000',
                }}
                className="font-normal mt-2 inline-block rounded-sm "
              >
                Savings applied.{' '}
                <span style={{ color: '#fff' }} className="underline">
                  Details
                </span>
              </p> */}
              <p className="text-sm mt-2 mb-2" style={{ color: '#999' }}>
                Retail Price: ${currentSelectedProduct?.retailPrice}
              </p>
              {/* <p className="mt-2.5">
                <Link
                  sx={{
                    color: '#000',
                    textDecorationColor: '#000',
                  }}
                >
                  More details...
                </Link>
              </p> */}
            </CardContent>
          </Card>
          <Button
            width="100%"
            size="small"
            disabled={
              _.isEmpty(groupedByColor)
            }
            use={'primary'}
            onClick={() => {
              selectDevice(currentSelectedProduct)
            }}
          >
            {isSelected ? 'Selected' : 'Select'} Device
          </Button>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  )
}


export default DeviceCard;

import React, {useEffect, useState} from "react";
import styled from '@emotion/styled'
import { Grid, IconButton } from '@mui/material'
import _ from 'lodash'
import { Title, Body } from '@vds/typography'
import { Delete, Edit } from "@mui/icons-material";
const SummaryContainer = ({selectedDeviceDetails}) => {
  
const StyledWrapper = styled.div`
border: 1px solid lightgray;
`

const StyledHeading = styled.h1`
display: inline-block !important;
font-size: 27px;
line-height: initial;
`

const StyledSubHeading = styled.h5`
fontsize: '11px';
fontweight: '700';
color: '#999999';
`

const SummaryWrapper = styled.div`
border-bottom: 1px solid #ccc;
padding:'10px'
`

const StyledTooltipDiv = styled.div`
&::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

&::-webkit-scrollbar-track {
  background: #f0f0f0;
}

&::-webkit-scrollbar-thumb {
  background-color: lightgray;
  border-radius: 20px;
  border: 2px solid #f0f0f0;
}
`

const StyledTag = (props) => {
const {
  children,
  className,
  bgColor = 'bg-gray-200',
  textColor = '#000000',
} = props
return (
  <span
    className={`font-bold rounded p-1 ${bgColor} ${className}`}
    style={{ fontSize: '10px', lineHeight: '16px', color: textColor }}
  >
    {children}
  </span>
)
}

  return (
       <StyledWrapper>
        <Grid
          container
          p={2}
          className="bg-gray-100"
          style={{ borderBottom: '1px solid #CCC' }}
        >
          <Title size="small" bold={true} color="#000000">
            Summary
          </Title>
        </Grid>
        <Grid container>
          <Grid container>
            {selectedDeviceDetails.map((item, idx) => {
              console.log(item,'item')
              return (
                <SummaryWrapper style={{padding:'10px'}}
                  key={`${item?.device}_${idx}`}
                  className="relative w-full p-3"
                >
                    <>
                      <StyledSubHeading className="mb-1">
                        DEVICE:
                      </StyledSubHeading>
                      <StyledTag>
                        SKU: {item?.deviceId}
                      </StyledTag>
                       <div className="mt-2 pb-3" >
                        <p
                          className="mt-2 mb-1"
                          style={{
                            fontSize: '14px',
                            lineHeight: '14px',
                            color: '#000000',
                            fontWeight: '700',
                          }}
                        >
                          {item?.deviceBrand}
                        </p>
                        {item?.selectedStorage && (
                          <p
                            style={{
                              fontSize: '12px',
                              lineHeight: '16px',
                              color: '#000000',
                            }}
                          >
                            ({`${item?.selectedStorage}`})
                          </p>
                        )}
                        <p
                          className="mt-1"
                          style={{
                            fontSize: '14px',
                            lineHeight: '16px',
                            color: '#000000',
                            fontStyle: 'italic',
                            fontWeight: '400',
                          }}
                        >
                          {`$ ${item?.remainingMonthPrice}`}
                          /mo for {item?.term} Months
                        </p>
                      </div>
                    </>
                                
                </SummaryWrapper>
              )
            })}
            <div style={{padding:'10px'}}> {selectedDeviceDetails.length}<b> {selectedDeviceDetails.length >1 ? 'Lines': 'Line'}</b></div>

          </Grid>
          
        </Grid>
      </StyledWrapper>
  )
}
export default SummaryContainer;
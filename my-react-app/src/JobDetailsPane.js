import styled from '@emotion/styled'
import { keyframes, styled as style } from '@mui/material/styles'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector'
import { StepButton, Tooltip, useScrollTrigger } from '@mui/material'
import { callCreateCart, callAddDEviceToCart, callValidateCart, validateCartLite, quoteservice, updateUserParam } from '../../../api/cartApis/cartApis'
import { useRef, useState } from 'react'
import React, { forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux'

const initialSteps = [
  { Stage: 'CreateCart', Status: 'P' },
  { Stage: 'Add Plan and Device', Status: 'P' },
  { Stage: 'Validate Cart', Status: 'P' },
  { Stage: 'Create quote', Status: 'P' },
]
const JobDetails = styled.span`
  font-weight: bold;
`
const pulse = keyframes`
0% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 black;
    border-radius: 50%;
    z-index: 9999;
}
70%{
    transform: scale(1);
    box-shadow: 0 0 0 10px black;
    border-radius: 50%;
    z-index: 9999;
}
100%{
     transform: scale(0.85);
    box-shadow: 0 0 0 0 black;
    border-radius: 50%;
    z-index: 9999;
}
`

const stepperStyle = {
  justifiedContent: 'center',
  '& .Mui-active': {
    '& .MuiStepIcon-root': {
      color: 'black',
      animation: `${pulse} 1.5s infinite`,
    },
  },
  '& .Mui-completed': {
    '& .MuiStepIcon-root': {
      color: 'black',
    },
  },
  '& .error-step': {
    '& .MuiStepIcon-root , & .MuiStepLabel-label': {
      color: 'red',
    },
  },
}

const CustomConnector = style(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#EE0000',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#EE0000',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: 'grey',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))

const JobDetailsPane = forwardRef(({ onSuccess, selectedDeviceCount, selectedDevices }, ref) => {
  const [BulkOrderStatus, setBulkOrderStatus] = useState(initialSteps);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [atgCartId, setatgCartId] = useState('');
  const [cartId, setCartId] = useState('');
const lineInfoRef = useRef([])
  const updateStatus = (index, status) => {
    setBulkOrderStatus(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], Status: status };
      return updated;
    })
  }
  const runAllSteps = async () => {
    function errorHandle(current) {
      setError('error');
      const index = current.findIndex(s => s.Status === 'IP');
      if (index !== -1) {
        const updated = [...current];
        updated[index] = { ...updated[index], Status: 'E' };
        setBulkOrderStatus(updated);
      }
    }
    setError('');
    setResult(null);
    try {
      const currentState = updateStatus(0, 'IP');
      // /securityservice/updateUserParam
      const updateUserParamRes = await updateUserParam()
      const { cartId, atgCartId, error } = await callCreateCart(selectedDeviceCount);
      if (error) {
        errorHandle(currentState)
      } else {
        updateStatus(0, 'C');
        setCartId(cartId);
        setatgCartId(atgCartId);
        updateStatus(1, 'IP');
        const addRes = await callAddDEviceToCart(cartId, atgCartId, selectedDevices);
        updateStatus(1, 'C');
        updateStatus(2, 'IP');
        const validateRes = await callValidateCart(cartId, atgCartId);
        const validateCartRes = await validateCartLite(cartId, atgCartId);
        updateStatus(2, 'C');
        updateStatus(3, 'IP');
        const cart =validateRes?.data?.cart?.cartHeader; 
        // const newLineInfo =validateRes?.data?.cart?.cartOrderDetail.lineInfo; 
        // lineInfoRef.current = newLineInfo;
        // console.log(lineInfo,'lineinfo')
        const {cpqCartId, cpqCartVersionId} = cart; 

        const quoteRes = await quoteservice(cartId, atgCartId,cpqCartId, cpqCartVersionId);

        updateStatus(3, 'C');
        setResult({
          reviewCart: validateRes,
          validateCartRes: validateCartRes,
          quote: quoteRes
        })
      }
      onSuccess(true);
    }
    catch (err) {
      errorHandle(BulkOrderStatus)
    }


  }
  useImperativeHandle(ref, () => ({
    // getLineInfo: () => lineInfoRef.current,
    runAllSteps
  }))
  return (
    <>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          Job ID <br /> <JobDetails>{JobId}</JobDetails>
        </span>
        <span>
          Job Created Date <br /> <JobDetails>{JobCreatedDate}</JobDetails>
        </span>
        {NoOfOrders && (
          <span>
            Number of Orders <br /> <JobDetails>{NoOfOrders}</JobDetails>
          </span>
        )}
        <span>
          Sub Account ID <br /> <JobDetails>{SubAccountId ?? '-'}</JobDetails>
        </span>
        <span>
          Recommendation ID <br />{' '}
          <JobDetails>{RecommendationId ?? '-'}</JobDetails>
        </span>
      </div> */}
      <div>
        <Stepper
          alternativeLabel
          connector={<CustomConnector />}
          sx={stepperStyle}
        >
          {BulkOrderStatus?.map(({ Status, Stage }) => (
            <Tooltip title={Status === 'E' ? 'There is an error in this step' : ''} placement="top-end" arrow disableHoverListener={Status !== 'E'}>
              <Step
                key={Stage}
                completed={Status === 'C'}
                active={Status === 'IP'}
                disabled={Status !== 'C' && Status !== 'IP' && Status !== 'E'}
                className={Status === 'E' ? 'error-step' : ''}
              >
                {/* <StepLabel StepIconComponent={CustomStepIcon}>{step}</StepLabel> */}
                <StepButton>{Stage}</StepButton>
              </Step>
            </Tooltip>
          ))}
        </Stepper>
      </div>
    </>
  )
}
)

export default JobDetailsPane

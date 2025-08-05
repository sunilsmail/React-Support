import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import DeviceCard from './DeviceCard'

const Devices = ({ devicesList = [], onDeviceSelect, selectedDevices }) => {
  return (
    <Box className="mt-20 mb-10 p-10" sx={{ flexGrow: 1, border: '1px solid #ccc', padding: '10px' }}>
      <Grid container spacing={{ xs: 2 }}>
        {devicesList.map((item, index) => {
          const isSelected = selectedDevices?.some((d) => d.productId === item.productId)
          return (
            <Grid
              item
              key={`pc-${index}`}
            >
              <DeviceCard device={item} isSelected={isSelected} selectDevice={(product) =>
                onDeviceSelect({ ...product, productId: item.ProductId })
              } />

            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}


export default Devices;

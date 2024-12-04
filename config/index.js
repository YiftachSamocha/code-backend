import configProd from './prod.js'
import configDev from './dev.js'

// Determine which configuration to use based on the current environment (production or development)
export var config

if (process.env.NODE_ENV === 'production') {
  config = configProd
} else {
  config = configDev
}

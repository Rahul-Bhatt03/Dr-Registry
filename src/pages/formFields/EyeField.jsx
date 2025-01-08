// import React from 'react';
// import {
//   Grid,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   TextField,
// } from '@mui/material';

// const EyeField = ({ 
//   type, 
//   title, 
//   options, 
//   hasOther, 
//   values, 
//   onChange, 
//   side 
// }) => {
//   const handleChange = (event) => {
//     const newValue = event.target.value;
//     // If clicking the same value, unselect it
//     if (values[side]?.value === newValue) {
//       onChange({
//         value: '',
//         otherValue: ''
//       });
//     } else {
//       onChange({
//         value: newValue,
//         otherValue: newValue === 'other' ? '' : values[side]?.otherValue || ''
//       });
//     }
//   };

//   const handleOtherChange = (event) => {
//     onChange({
//       value: 'other',
//       otherValue: event.target.value
//     });
//   };

//   return (
//     <Grid item xs={12} sm={6}>
//       <FormControl fullWidth>
//         <FormLabel>{`${title} - ${side === 'OD' ? 'Right Eye' : 'Left Eye'}`}</FormLabel>
//         <RadioGroup 
//           value={values[side]?.value || ''} 
//           onChange={handleChange}
//         >
//           {options.map((option) => (
//             <FormControlLabel
//               key={option.value}
//               value={option.value}
//               control={<Radio />}
//               label={option.label}
//             />
//           ))}
//         </RadioGroup>
//         {hasOther && values[side]?.value === 'other' && (
//           <TextField
//             fullWidth
//             placeholder="Please specify..."
//             margin="normal"
//             value={values[side]?.otherValue || ''}
//             onChange={handleOtherChange}
//           />
//         )}
//       </FormControl>
//     </Grid>
//   );
// };

// export default EyeField;
import React from 'react';
import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';

const EyeField = ({ 
  type, 
  title, 
  options, 
  hasOther, 
  values, 
  onChange, 
  side 
}) => {
  const handleChange = (event) => {
    const newValue = event.target.value;

    // If clicking the same value, unselect it
    if (values?.value === newValue) {
      onChange({
        value: '',
        otherValue: '',
      });
    } else {
      onChange({
        value: newValue,
        otherValue: newValue === 'other' ? '' : values?.otherValue || '',
      });
    }
  };

  const handleOtherChange = (event) => {
    onChange({
      value: 'other',
      otherValue: event.target.value,
    });
  };

  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <FormLabel>{`${title} - ${side === 'OD' ? 'Right Eye' : 'Left Eye'}`}</FormLabel>
        <RadioGroup 
          value={values?.value || ''} 
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {hasOther && values?.value === 'other' && (
          <TextField
            fullWidth
            placeholder="Please specify..."
            margin="normal"
            value={values?.otherValue || ''}
            onChange={handleOtherChange}
          />
        )}
      </FormControl>
    </Grid>
  );
};

export default EyeField;

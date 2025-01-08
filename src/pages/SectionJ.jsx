import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formSections } from "./formFields/formField.js";
import EyeField from "./formFields/EyeField.jsx";
import { saveSectionJData } from "../features/sectionSlice.js";
import axios from "axios";
import { submitFormData } from "../features/formSubmissionSlice.js";
import { fetchFollowUps } from "../features/genericSlice.js";
import { fetchIntravitrealInjectionTypes } from "../features/intravitrealInjectionSlice";
import { fetchDiabeticRetinopathyTimes } from "../features/diabeticRetinopathyTimesSlice";
import { fetchSurgeryTypes } from "../features/surgerySlice.js";
import { styled } from "@mui/material/styles";
import { updateDrRegistryInfo } from '../features/updateFormSlice.js'; 
import { toast } from "react-toastify";


const SectionJ = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sectionJ } = useSelector((state) => state.form);
  const sectionIData = useSelector((state) => state.form.sectionI);
  const sectionHData = useSelector((state) => state.form.sectionH);
 const sectionGData = useSelector((state) => state.form.sectionG);
  const sectionFData = useSelector((state) => state.form.sectionF);
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

   // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
   const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
   const id = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));

  const [sourceData,setSourceData]=useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [selectedOption, setSelectedOption] = useState("");
  const followUps = useSelector((state) => state.generic.data);
  const followUpsLoading = useSelector((state) => state.generic.loading);
  const selectedFollowUp = useSelector(
    (state) => state.form.sectionJ.followUpId
  );
  const { types } = useSelector((state) => state.surgery);

  const EyeSelection = () => {
    const [odYesNo, setOdYesNo] = useState("");
    const [odValue, setOdValue] = useState(null); // Stores numeric ID for OD
    const [osYesNo, setOsYesNo] = useState("");
    const [osValue, setOsValue] = useState(null); // Stores numeric ID for OS

    const handleOdYesNoChange = (event) => {
      setOdYesNo(event.target.value);
      if (event.target.value === "Yes") {
        setOdValue(null); // Reset OD dropdown value
      }
    };

    const handleOsYesNoChange = (event) => {
      setOsYesNo(event.target.value);
      if (event.target.value === "Yes") {
        setOsValue(null); // Reset OS dropdown value
      }
    };

    const handleOdDropdownChange = (event) => {
      setOdValue(Number(event.target.value)); // Ensure numeric ID is stored
    };

    const handleOsDropdownChange = (event) => {
      setOsValue(Number(event.target.value)); // Ensure numeric ID is stored
    };
  };

  const handleSourceDataChange=(index,field,value)=>{
    setSourceData(prevData=>{
      const newData=[...prevData];
      if(!newData[index]){
        newData[index]={id:0,isActive:true};
      }
      newData[index]={
        ...newData[index],
        [field]:value
      };
      return newData;
    })
  }

  useEffect(() => {
    dispatch(fetchFollowUps());
    dispatch(fetchIntravitrealInjectionTypes());
    dispatch(fetchDiabeticRetinopathyTimes());
    dispatch(fetchSurgeryTypes());
  }, []);

  const handleFollowUpChange = (event) => {
    const selectedId = event.target.value;
    const selectedLabel = followUps.find(
      (item) => item.id === selectedId
    )?.label;
    setSelectedOption(selectedLabel);
    dispatch(
      saveSectionJData({ ...sectionJ, followUpId: JSON.parse(selectedId) })
    );
  };

  const intravitrealInjectionTypes = useSelector(
    (state) => state.intravitrealInjection.data
  );
  const diabeticRetinopathyTimes = useSelector(
    (state) => state.diabeticRetinopathy.data
  );

  // Get data for all sections from Redux store
  const allSectionsData = useSelector((state) => state.form);

  // Get submission state from Redux
  const {
    loading: submissionLoading,
    error,
    success,
  } = useSelector((state) => state.formSubmission);

  //to gather data from redux store of only section j
  const savedData = useSelector((state) => state.form.sectionJ);

  // Local State to Manage Form Data
  const [formDataToSubmit, setFormDataToSubmit] = useState(savedData || {});

  useEffect(() => {
    if (success) {
      alert("Form submitted successfully!");
      navigate("/home");
      // dispatch(resetFormSubmissionState()); // Reset submission state
    }
  }, [success]);

  const handleEyeFieldChange = (
    title,
    storeKeyOD,
    storeKeyOS,
    side,
    value,
    type
  ) => {
    // Ensure the value is properly parsed
    const parseValue = (val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (!isNaN(val)) return Number(val);
      return val;
    };

    const parsedValue = parseValue(value); // Directly parse value
    console.log("Parsed Value:", parsedValue);
    console.log("storeKeyOD:", storeKeyOD);
    console.log("storeKeyOS:", storeKeyOS);
    console.log("Side:", side);
    console.log("Title:", title);
    console.log("formDataToSubmit before update:", formDataToSubmit);

    setFormDataToSubmit((prev) => {
      const updatedData = {
        ...prev,
        [storeKeyOD]:
          side === "OD"
            ? type === "text"
              ? value
              : JSON.parse(parsedValue.value)
            : prev[storeKeyOD],
        [storeKeyOS]:
          side === "OS"
            ? type === "text"
              ? value
              : JSON.parse(parsedValue.value)
            : prev[storeKeyOS],
        [title]: {
          ...(prev[title] || {}), // Ensure title exists in the object
          [side]: parsedValue,
        },
      };

      console.log("Updated Data:", updatedData);
      dispatch(saveSectionJData(updatedData)); // Save to Redux
      return updatedData;
    });
  };

    const handleSubmit = async () => {
      event.preventDefault();

      setLoading(true);
      try {

//fiter out empty rows from sourceData
const validSourceData=sourceData.filter(item=>
  item && (item.sourceName||item.fileNo)
).map(item=>({
  id:item.id||0,
  sourceName:item.sourceName||null,
  fileNo: item.fileNo||null,
  isActive:true
}))

        const payload = {
          ...sectionBData,
          ...sectionCData,
          ...sectionDData,
          ...sectionEData,
          ...sectionFData,
          ...sectionGData,
          ...sectionHData,
          ...sectionIData,
          ...formDataToSubmit,
          patientInfoId,
          id,
          updateDataSourceDTOs: validSourceData, // Add the source data array here
        };
        console.log("Section J Payload:", payload);

    
        // Dispatch the update action
        await dispatch(updateDrRegistryInfo({ registryData: payload })).unwrap();
    
        toast.success("Form submitted successfully!");

         // Update the selected alphabet and navigate
         const nextAlphabet = 'Demographic-History';
         setSelectedAlphabet(nextAlphabet);
         localStorage.setItem('selectedAlphabet', nextAlphabet);
         navigate(`/section-${nextAlphabet}`);
        toast.success("Form submitted successfully!");
      
      } catch (error) {
        console.error("Error submitting form data:", error);
        toast.error(
          error.message || "There was an error submitting the form. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    

  const handlePreviousPage = () => {
    dispatch(saveSectionJData(formDataToSubmit)); // Save current form data before navigating
    handlePreviousClick(); // Call the function provided by the Layout to navigate
  };

  // Update local state and Redux store when form fields change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataToSubmit((prev) => {
      const updatedData = { ...prev, [name]: value };
      dispatch(saveSectionJData(updatedData)); // Save to Redux
      return updatedData;
    });
  };

  // Fallback for invalid `formSections`
  if (!Array.isArray(formSections)) {
    console.error("formSections is not an array or is undefined");
  }

  const commonTextFieldProps = {
    fullWidth: true,
    variant: "outlined",
    size: "medium",
    sx: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 1,
      },
    },
  };


  return (
    <Container>
      <Box
        sx={{
          padding: 4,
          maxWidth: 1000,
          margin: "auto",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6" gutterBottom>
          SECTION J: DIABETIC RETINOPATHY
        </Typography>

        {formSections.map((section, index) => (
          <React.Fragment key={index}>
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            <Grid container spacing={3}>
              {["OD", "OS"].map((side) =>
                section.type === "text" ? (
                  <Grid item xs={12} sm={6} key={`${section.title}-${side}`}>
                    <TextField
                      fullWidth
                      label={`${section.title} (${side})`}
                      value={formDataToSubmit[section.title]?.[side] || null}
                      onChange={(e) =>
                        handleEyeFieldChange(
                          section.title,
                          section.storeKeyOD,
                          section.storeKeyOS,
                          side,
                          e.target.value,
                          "text"
                        )
                      }
                      variant="outlined"
                    />
                  </Grid>
                ) : (
                  <EyeField
                    key={`${section.title}-${side}`}
                    type={section.type}
                    title={section.title}
                    options={section.options || []}
                    hasOther={section.conditional}
                    values={formDataToSubmit[section.title]?.[side] || null}
                    onChange={(value) =>
                      handleEyeFieldChange(
                        section.title,
                        section.storeKeyOD,
                        section.storeKeyOS,
                        side,
                        value,
                        "bool"
                      )
                    }
                    side={side}
                  />
                )
              )}
            </Grid>
          </React.Fragment>
        ))}


        <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {/* General Heading */}
  <Grid item xs={12}>
    <Typography
      variant="h6"
      gutterBottom
      sx={{ fontWeight: 600, color: "#3f51b5", textAlign: "center" }}
    >
      Type of Diabetic Retinopathy
    </Typography>
  </Grid>
          {["OD", "OS"].map((side) => (
            <Grid item xs={12} sm={6} key={side}>
              <Typography
                variant="h6"youtu
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                {side === "OD" ? "Right Eye" : "Left Eye"}
              </Typography>
              <RadioGroup
                name={`diabeticRetinopathyType${side}`}
                value={
                  formDataToSubmit[`diabeticRetinopathyType${side}`] || null
                }
                onChange={(e) => {
                  const numericValue = parseInt(e.target.value, 10); // Ensure the value is numeric
                  handleInputChange({
                    target: {
                      name: `diabeticRetinopathyType${side}`,
                      value: numericValue,
                    },
                  });
                }}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {[
                  { value: 1, label: "Non-Proliferative" },
                  { value: 2, label: "Proliferative" },
                ].map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </Grid>
          ))}
        </Grid>

        {/* Specify (Intravitreal Injection) & Time Section */}
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#f4f6f8",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
          }}
        >
          <Grid container spacing={3}>
            {/* OD Section */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "#3f51b5" }}
              >
                Right Eye (OD)
              </Typography>

              {/* Yes/No for Specify (Intravitreal Injection) - OD */}
              <Typography
                variant="subtitle1"
                sx={{ marginBottom: "8px", fontWeight: 500 }}
              >
                Specify (Intravitreal Injection)?
              </Typography>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <Button
                  variant={
                    formDataToSubmit.isDiabeticRetinopathyODTreatmentIntravitrealInjection
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    handleInputChange({
                      target: {
                        name: "isDiabeticRetinopathyODTreatmentIntravitrealInjection",
                        value: true,
                      },
                    })
                  }
                >
                  Yes
                </Button>
                <Button
                  variant={
                    !formDataToSubmit.isDiabeticRetinopathyODTreatmentIntravitrealInjection
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    handleInputChange({
                      target: {
                        name: "isDiabeticRetinopathyODTreatmentIntravitrealInjection",
                        value: false,
                      },
                    })
                  }
                >
                  No
                </Button>
              </div>

              {/* DDL and Additional Fields for OD */}
              {formDataToSubmit.isDiabeticRetinopathyODTreatmentIntravitrealInjection && (
                <>
                  <TextField
                    select
                    label="Specify Type"
                    value={formDataToSubmit.odIntravitrealInjectionTypeId || ""}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: "odIntravitrealInjectionTypeId",
                          value: parseInt(e.target.value),
                        },
                      })
                    }
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      marginBottom: "16px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <option value="">Select</option>
                    {intravitrealInjectionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </TextField>

                  {["Anti VEGF", "Others"].includes(
                    intravitrealInjectionTypes.find(
                      (type) =>
                        type.id ===
                        formDataToSubmit.odIntravitrealInjectionTypeId
                    )?.name
                  ) && (
                    <TextField
                      label="Specify Details"
                      value={
                        formDataToSubmit.odIntravitrealInjectionOtherType || ""
                      }
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "odIntravitrealInjectionOtherType",
                            value: e.target.value,
                          },
                        })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  )}
                </>
              )}
            </Grid>

            {/* OS Section */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "#3f51b5" }}
              >
                Left Eye (OS)
              </Typography>

              {/* Yes/No for Specify (Intravitreal Injection) - OS */}
              <Typography
                variant="subtitle1"
                sx={{ marginBottom: "8px", fontWeight: 500 }}
              >
                Specify (Intravitreal Injection)?
              </Typography>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <Button
                  variant={
                    formDataToSubmit.isDiabeticRetinopathyOSTreatmentIntravitrealInjection
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    handleInputChange({
                      target: {
                        name: "isDiabeticRetinopathyOSTreatmentIntravitrealInjection",
                        value: true,
                      },
                    })
                  }
                >
                  Yes
                </Button>
                <Button
                  variant={
                    !formDataToSubmit.isDiabeticRetinopathyOSTreatmentIntravitrealInjection
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    handleInputChange({
                      target: {
                        name: "isDiabeticRetinopathyOSTreatmentIntravitrealInjection",
                        value: false,
                      },
                    })
                  }
                >
                  No
                </Button>
              </div>

              {/* DDL and Additional Fields for OS */}
              {formDataToSubmit.isDiabeticRetinopathyOSTreatmentIntravitrealInjection && (
                <>
                  <TextField
                    select
                    label="Specify Type"
                    value={formDataToSubmit.osIntravitrealInjectionTypeId || ""}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: "osIntravitrealInjectionTypeId",
                          value: parseInt(e.target.value),
                        },
                      })
                    }
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      marginBottom: "16px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <option value="">Select</option>
                    {intravitrealInjectionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </TextField>

                  {["Anti VEGF", "Others"].includes(
                    intravitrealInjectionTypes.find(
                      (type) =>
                        type.id ===
                        formDataToSubmit.osIntravitrealInjectionTypeId
                    )?.name
                  ) && (
                    <TextField
                      label="Specify Details"
                      value={
                        formDataToSubmit.osIntravitrealInjectionOtherType || ""
                      }
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "osIntravitrealInjectionOtherType",
                            value: e.target.value,
                          },
                        })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  )}
                </>
              )}
            </Grid>

            {/* Separate Time Section */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "#3f51b5", textAlign: "center" }}
              >
                Time Selection
              </Typography>
              <Grid container spacing={3}>
                {["od", "os"].map((side) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={side}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <TextField
                      select
                      label={`Time - ${side}`}
                      value={
                        formDataToSubmit[`${side}DiabeticRetinopathyTimeId`] ||
                        null
                      }
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: `${side}DiabeticRetinopathyTimeId`,
                            value: parseInt(e.target.value),
                          },
                        })
                      }
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    >
                      <option value="">Select</option>
                      {diabeticRetinopathyTimes.map((time) => (
                        <option key={time.id} value={time.id}>
                          {time.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Treatment (Surgery) */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Treatment (Surgery)
          </Typography>

          {/* OD (Right Eye) Section */}
          <Typography variant="subtitle1" gutterBottom>
            OD (Right Eye)
          </Typography>
          <RadioGroup
            name="odSurgeryPerformed"
            value={formDataToSubmit.odSurgeryPerformed ? "yes" : "no"}
            onChange={(e) => {
              const value = e.target.value === "yes"; // Convert "yes"/"no" to boolean
              setFormDataToSubmit((prev) => {
                const updatedData = {
                  ...prev,
                  odSurgeryPerformed: value,
                  odSurgeryType: null,
                }; // Clear surgery type on toggle
                dispatch(saveSectionJData(updatedData)); // Save to Redux
                return updatedData;
              });
            }}
            sx={{ display: "flex", flexDirection: "row", marginBottom: 2 }}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Conditional Dropdown for OD */}
          {formDataToSubmit.odSurgeryPerformed && (
            <TextField
              select
              label="Select OD Surgery Type"
              value={formDataToSubmit.odSurgeryType || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10); // Convert the id to a numeric value
                setFormDataToSubmit((prev) => {
                  const updatedData = { ...prev, odSurgeryType: value };
                  dispatch(saveSectionJData(updatedData)); // Save to Redux
                  return updatedData;
                });
              }}
              fullWidth
              SelectProps={{
                native: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            >
              <option value="">Select</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </TextField>
          )}

          {/* OS (Left Eye) Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ marginTop: 4 }}>
            OS (Left Eye)
          </Typography>
          <RadioGroup
            name="osSurgeryPerformed"
            value={formDataToSubmit.osSurgeryPerformed ? "yes" : "no"}
            onChange={(e) => {
              const value = e.target.value === "yes"; // Convert "yes"/"no" to boolean
              setFormDataToSubmit((prev) => {
                const updatedData = {
                  ...prev,
                  osSurgeryPerformed: value,
                  osSurgeryType: null,
                }; // Clear surgery type on toggle
                dispatch(saveSectionJData(updatedData)); // Save to Redux
                return updatedData;
              });
            }}
            sx={{ display: "flex", flexDirection: "row", marginBottom: 2 }}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>

          {/* Conditional Dropdown for OS */}
          {formDataToSubmit.osSurgeryPerformed && (
            <TextField
              select
              label="Select OS Surgery Type"
              value={formDataToSubmit.osSurgeryType || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10); // Convert the id to a numeric value
                setFormDataToSubmit((prev) => {
                  const updatedData = { ...prev, osSurgeryType: value };
                  dispatch(saveSectionJData(updatedData)); // Save to Redux
                  return updatedData;
                });
              }}
              fullWidth
              SelectProps={{
                native: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            >
              <option value="">Select</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </TextField>
          )}
        </Box>

        {/* Follow-up Selection */}
        <Grid>
          <Typography variant="h6">Follow Up</Typography>
          {followUpsLoading ? (
            <Typography>Loading follow-ups...</Typography>
          ) : (
            <RadioGroup
              onChange={handleFollowUpChange}
              value={selectedFollowUp || null}
            >
              {followUps.map((followUp) => (
                <FormControlLabel
                  key={followUp.id}
                  value={parseInt(followUp.id)}
                  control={<Radio />}
                  label={followUp.name} // Assuming 'name' contains the follow-up label
                />
              ))}
            </RadioGroup>
          )}
          {selectedOption && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Selected Follow-Up: <strong>{selectedOption}</strong>
            </Typography>
          )}
        </Grid>

        <Container
          maxWidth="lg"
          sx={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <form>

          <Typography variant="h4" align="center" gutterBottom>
        Source of Data
      </Typography>

      {/* Table Layout */}
      <Paper sx={{ padding: 3 }}>
  <Grid container spacing={3}>
    {/* Headers remain the same */}
    
    {/* Replace the static rows with a mapped array */}
    {[0, 1, 2].map((rowIndex) => (
      <React.Fragment key={rowIndex}>
        <Grid item xs={4}>
          <TextField 
            label="SN" 
            fullWidth
            value={sourceData[rowIndex]?.sn || null}
            onChange={(e) => handleSourceDataChange(rowIndex, 'sn', e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            label="Name of Source" 
            fullWidth
            value={sourceData[rowIndex]?.sourceName || ''}
            onChange={(e) => handleSourceDataChange(rowIndex, 'sourceName', e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            label="File No (MRD No.)" 
            fullWidth
            value={sourceData[rowIndex]?.fileNo || ''}
            onChange={(e) => handleSourceDataChange(rowIndex, 'fileNo', e.target.value)}
          />
        </Grid>
      </React.Fragment>
    ))}
  </Grid>
</Paper>

            {/* Date of Data Collection */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                marginTop: "24px",
                marginBottom: "16px",
              }}
            >
              Date of Data Collection
            </Typography>

            {/* Grid for the Date Input */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  {...commonTextFieldProps}
                  label="Date of Data Collection"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formDataToSubmit.dataCollectionDate || null}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: "dataCollectionDate",
                        value: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>

            {/* Name of Enumerator */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                marginTop: "24px",
                marginBottom: "16px",
              }}
            >
              Name of Enumerator
            </Typography>
            <TextField
              fullWidth
              label="Name"
              name="enumeratorName"
              value={formDataToSubmit.enumeratorName || null}
              variant="outlined"
              size="small"
              onChange={handleInputChange}
              sx={{ marginBottom: "24px" }}
            />
          </form>
        </Container>

        <Grid container spacing={3} justifyContent="center" marginTop={3}>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handlePreviousPage}
            >
              Previous
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading} // From Redux state
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SectionJ;

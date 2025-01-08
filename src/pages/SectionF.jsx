import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionFData } from "../features/sectionSlice.js"; // Update the import path if needed
import { fetchOcularHistoryTitles } from "../features/ocularHistoryTitles.js";
import { updateDrRegistryInfo } from '../features/updateFormSlice.js'; // Import the update action


const SectionF = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve existing data from the Redux store
  const sectionFData = useSelector((state) => state.form.sectionF);
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

    // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
    const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
    const id = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));
 

  // Destructure ocularHistoryTitles, loading, and error from Redux state
  const { ocularHistoryTitles, loading, error } = useSelector(
    (state) => state.oht
  );

  const [selectedTitleId, setSelectedTitleId] = useState("");
  const [odField, setOdField] = useState({
    show: false,
    value: null,
    distance: null,
  });
  const [osField, setOsField] = useState({
    show: false,
    value: null,
    distance: null,
  });

  // Local form state
  const [formData, setFormData] = useState(sectionFData || {});

  useEffect(() => {
    setSelectedAlphabet("Ocular-History");
    localStorage.setItem("selectedAlphabet", "Ocular-History");
    if (sectionFData) {
      setFormData(sectionFData);
    }
    dispatch(fetchOcularHistoryTitles());
  }, []);


  // const handleTitleChange = (event) => {
  //   const titleId = event.target.value;
  //   setSelectedTitleId(titleId);
  //   setOdField({ ...odField, show: titleId !== null });
  //   setOsField({ ...osField, show: titleId !== null });
  // };

  // Handle OD/OS Yes/No selection
  const handleFieldChange = (field, value) => {
    if (field === "od") {
      setOdField((prev) => ({
        ...prev,
        value: value === "yes",
        distance: value === "yes" ? prev.distance : null,
      }));
    } else {
      setOsField((prev) => ({
        ...prev,
        value: value === "yes",
        distance: value === "yes" ? prev.distance : null,
      }));
    }
    saveDataToRedux();
  };

  // Handle distance change
  const handleDistanceChange = (field, distance) => {
    if (field === "od") {
      setOdField((prev) => ({ ...prev, distance }));
    } else {
      setOsField((prev) => ({ ...prev, distance }));
    }
    saveDataToRedux();
  };

  // Save data to Redux
  const saveDataToRedux = () => {
    dispatch(
      saveSectionFData({
        selectedTitleId,
        odField,
        osField,
      })
    );
  };

  const [historyData, setHistoryData] = useState({});
  const [dtos, setDtos] = useState([]);

  const handleRadioChange = (id, field, value) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [id]: {
          ...prevData[id],
          ocularHistoryAndExaminationTitleInfoId: id,
          [field]: JSON.parse(value),
        },
      };

      console.log(updatedData);
      dispatch(saveSectionFData(updatedData));
      return updatedData;
    });
  };
  console.log(dtos);

  const handleDurationChange = (id, field, value) => {
    setFormData((prevData) => {
      // console.log(prevData[id][field]);
      const updatedData = {
        ...prevData,
        [id]: {
          ...prevData[id],
          ocularHistoryAndExaminationTitleInfoId: id,
          [`${field}Duration`]: prevData[id][field] ? parseInt(value) : null,
        },
      };
      dispatch(saveSectionFData(updatedData));
      return updatedData;
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]:parseInt(value,10)||null };
      dispatch(saveSectionFData(updatedData)); // Save data to Redux
      return updatedData;
    });
  };

  const handleNextPage = async() => {
    try{
      dispatch(saveSectionFData(formData)); 
      const payload = {
        ...sectionBData,
        ...sectionCData,
        ...sectionDData,
        ...sectionEData,
        ...formData,
        patientInfoId, 
        id 
      };
      console.log("Section F Payload:", payload);

      await dispatch(updateDrRegistryInfo({ registryData: payload })).unwrap();

       // Update the selected alphabet and navigate
       const nextAlphabet = 'External-Examination';
       setSelectedAlphabet(nextAlphabet);
       localStorage.setItem('selectedAlphabet', nextAlphabet);
       navigate(`/section-${nextAlphabet}`);

      handleNextClick(); // Call the function provided by the Layout to navigate

    }catch(error){
      console.error("Error updating registry info:", error);
    }
  };


  const handlePreviousPage = () => {
    dispatch(saveSectionFData(formData)); // Ensure data is saved before navigation
    handlePreviousClick(); // Call the function provided by the Layout to navigate
  };

  // console.log(ocularHistoryTitles)

  return (
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
      <Typography variant="h6" marginBottom={2}>
        Section F: Ocular History & Examination
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Any Present Eye Complaint
          </Typography>
        </Grid>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Failed to fetch titles: {error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="center">OD</TableCell>
                  <TableCell align="center">OS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ocularHistoryTitles.map((title) => (
                  <TableRow key={title.id}>
                    <TableCell>{title.name}</TableCell>
                    <TableCell align="center">
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          value={formData[title.id]?.isOD ? true : false}
                          onChange={(e) =>
                            handleRadioChange(title.id, "isOD", e.target.value)
                          }
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                      {formData[title.id]?.isOD && (
                        <TextField
                          fullWidth
                          size="small"
                          margin="dense"
                          label="Duration (OD)"
                          value={formData[title.id]?.odDuration || null}
                          onChange={(e) =>
                            handleDurationChange(
                              title.id,
                              "od",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          value={formData[title.id]?.isOS ? true : false}
                          onChange={(e) =>
                            handleRadioChange(title.id, "isOS", e.target.value)
                          }
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                      {formData[title.id]?.isOS && (
                        <TextField
                          fullWidth
                          size="small"
                          margin="dense"
                          label="Duration (OS)"
                          value={formData[title.id]?.osDuration || null}
                          onChange={(e) =>
                            handleDurationChange(
                              title.id,
                              "os",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Eye Evaluation */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Eye Evaluation</Typography>
            <RadioGroup
              row
              name="eyeEvaluation"
              value={formData.eyeEvaluation || null}
              onChange={handleChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="First Time Eye Evaluation"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Regular Eye Check Up"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Visual Acuity */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Visual Acuity
          </Typography>
        </Grid>
        {[
          "presentingvisualacuityDistance",
          "unaidedvisualacuityDistance",
          "bestcorrectedvisualacuityDistance",
        ].map((type, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`${type.replace(/([a-z])([A-Z])/g, "$1 $2")} (OD)`}
                name={`${type}OD`}
                value={parseInt(formData[`${type}OD`]) || null}
                onChange={handleChange }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`${type.replace(/([a-z])([A-Z])/g, "$1 $2")} (OS)`}
                name={`${type}OS`}
                value={parseInt(formData[`${type}OS`]) || null}
                onChange={handleChange }
                variant="outlined"
              />
            </Grid>
          </React.Fragment>
        ))}
        {[
          "presentingvisualacuityNear",
          "unaidedvisualacuityNear",
          "bestcorrectedvisualacuityNear",
        ].map((type, index) => (
          <React.Fragment key={index + 3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`${type.replace(/([a-z])([A-Z])/g, "$1 $2")} (OD)`}
                name={`${type}OD`}
                value={parseInt(formData[`${type}OD`]) || null}
                onChange={handleChange }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`${type.replace(/([a-z])([A-Z])/g, "$1 $2")} (OS)`}
                name={`${type}OS`}
                value={parseInt(formData[`${type}OS`]) || null}
                onChange={handleChange }
                variant="outlined"
              />
            </Grid>
          </React.Fragment>
        ))}

        {/* Navigation Buttons */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handlePreviousPage}
          >
            Previous Page
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleNextPage}
          >
            Next Page
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionF;

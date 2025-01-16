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
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveSectionFData } from "../features/sectionSlice.js";
import { fetchOcularHistoryTitles } from "../features/ocularHistoryTitles.js";
import { addOcularHistory } from "../features/ocularHistorySlice.js";

const normalizeFormData = (data) => {
  const defaultData = {
    registryInfoId: 0,
    testType: null,
    presentingvisualacuityDistanceOD: null,
    presentingvisualacuityDistanceOS: null,
    presentingvisualacuityNearOD: null,
    presentingvisualacuityNearOS: null,
    unaidedvisualacuityDistanceOD: null,
    unaidedvisualacuityDistanceOS: null,
    unaidedvisualacuityNearOD: null,
    unaidedvisualacuityNearOS: null,
    bestcorrectedvisualacuityDistanceOD: null,
    bestcorrectedvisualacuityDistanceOS: null,
    bestcorrectedvisualacuityNearOD: null,
    bestcorrectedvisualacuityNearOS: null,
    ocularHistoryAndExaminationInfoDTOs: []
  };

  return { ...defaultData, ...data };
};

const SectionF = ({
  selectedAlphabet,
  setSelectedAlphabet,
  handleNextClick,
  handlePreviousClick,
  updateFormStatus
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sectionFData = useSelector((state) => state.form.sectionF);
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

  const patientInfoId = parseInt(localStorage.getItem('currentpatientInfoId'));
  const registryInfoId = parseInt(sectionBData.DrRegistryId || localStorage.getItem('DrRegistryId'));

  const { ocularHistoryTitles, loading, error } = useSelector(
    (state) => state.oht
  );

  const [formData, setFormData] = useState(() => normalizeFormData(sectionFData || {}));

  useEffect(() => {
    setSelectedAlphabet("Ocular-History");
    localStorage.setItem("selectedAlphabet", "Ocular-History");
    dispatch(fetchOcularHistoryTitles());
  }, []);

  const handleRadioChange = (titleId, field, value) => {
    setFormData((prevData) => {
      const dtos = [...(prevData.ocularHistoryAndExaminationInfoDTOs || [])];
      const existingIndex = dtos.findIndex(
        dto => dto.ocularHistoryAndExaminationTitleInfoId === titleId
      );

      if (existingIndex >= 0) {
        dtos[existingIndex] = {
          ...dtos[existingIndex],
          [field]: JSON.parse(value)
        };
      } else {
        dtos.push({
          ocularHistoryAndExaminationTitleInfoId: titleId,
          [field]: JSON.parse(value),
          odDuration: null,
          osDuration: null
        });
      }

      const updatedData = {
        ...prevData,
        ocularHistoryAndExaminationInfoDTOs: dtos
      };

      dispatch(saveSectionFData(updatedData));
      return updatedData;
    });
  };

  const handleDurationChange = (titleId, field, value) => {
    setFormData((prevData) => {
      const dtos = [...(prevData.ocularHistoryAndExaminationInfoDTOs || [])];
      const existingIndex = dtos.findIndex(
        dto => dto.ocularHistoryAndExaminationTitleInfoId === titleId
      );

      if (existingIndex >= 0) {
        dtos[existingIndex] = {
          ...dtos[existingIndex],
          [`${field}Duration`]: value ? parseInt(value) : null
        };
      } else {
        dtos.push({
          ocularHistoryAndExaminationTitleInfoId: titleId,
          isOD: false,
          isOS: false,
          [`${field}Duration`]: value ? parseInt(value) : null
        });
      }

      const updatedData = {
        ...prevData,
        ocularHistoryAndExaminationInfoDTOs: dtos
      };

      dispatch(saveSectionFData(updatedData));
      return updatedData;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value ? parseInt(value) : null
      };
      dispatch(saveSectionFData(updatedData));
      return updatedData;
    });
  };

  const isFormComplete = () => {
    const requiredFields = [
      'testType',
      'presentingvisualacuityDistanceOD',
      'presentingvisualacuityDistanceOS',
      'unaidedvisualacuityDistanceOD',
      'unaidedvisualacuityDistanceOS',
      'bestcorrectedvisualacuityDistanceOD',
      'bestcorrectedvisualacuityDistanceOS'
    ];

    const hasRequiredFields = requiredFields.every(field => 
      formData[field] !== null && formData[field] !== undefined
    );

    const hasOcularHistory = formData.ocularHistoryAndExaminationInfoDTOs?.length > 0;

    return hasRequiredFields && hasOcularHistory;
  };

  const handleNextPage = async () => {
    try {
      const normalizedData = {
        ...normalizeFormData(formData),
        registryInfoId
      };

      const isComplete = isFormComplete();
      if (updateFormStatus) {
        updateFormStatus('Ocular-History', isComplete);
      }

      await dispatch(addOcularHistory({ registryData: normalizedData })).unwrap();
      
      const nextAlphabet = 'External-Examination';
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem('selectedAlphabet', nextAlphabet);
      navigate(`/section-${nextAlphabet}`);

      handleNextClick();
    } catch (error) {
      console.error("Error submitting ocular history:", error);
      alert("Failed to submit ocular history. Please try again.");
    }
  };

  const handlePreviousPage = () => {
    dispatch(saveSectionFData(formData));
    handlePreviousClick();
  };

  const getExistingData = (titleId) => {
    return formData.ocularHistoryAndExaminationInfoDTOs?.find(
      dto => dto.ocularHistoryAndExaminationTitleInfoId === titleId
    ) || {};
  };

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
        {loading ? (
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Typography color="error">Failed to fetch titles: {error}</Typography>
          </Grid>
        ) : (
          <Grid item xs={12}>
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
                  {ocularHistoryTitles.map((title) => {
                    const existingData = getExistingData(title.id);
                    return (
                      <TableRow key={title.id}>
                        <TableCell>{title.name}</TableCell>
                        <TableCell align="center">
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              value={existingData.isOD?.toString() || "false"}
                              onChange={(e) =>
                                handleRadioChange(title.id, "isOD", e.target.value)
                              }
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="No"
                              />
                            </RadioGroup>
                          </FormControl>
                          {existingData.isOD && (
                            <TextField
                              fullWidth
                              size="small"
                              margin="dense"
                              label="Duration (OD)"
                              value={existingData.odDuration || ""}
                              onChange={(e) =>
                                handleDurationChange(title.id, "od", e.target.value)
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              value={existingData.isOS?.toString() || "false"}
                              onChange={(e) =>
                                handleRadioChange(title.id, "isOS", e.target.value)
                              }
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="No"
                              />
                            </RadioGroup>
                          </FormControl>
                          {existingData.isOS && (
                            <TextField
                              fullWidth
                              size="small"
                              margin="dense"
                              label="Duration (OS)"
                              value={existingData.osDuration || ""}
                              onChange={(e) =>
                                handleDurationChange(title.id, "os", e.target.value)
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Eye Evaluation</Typography>
            <RadioGroup
              row
              name="testType"
              value={formData.testType?.toString() || ""}
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

        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Visual Acuity
          </Typography>
        </Grid>

        {[
          { prefix: 'presentingvisualacuity', label: 'Presenting Visual Acuity' },
          { prefix: 'unaidedvisualacuity', label: 'Unaided Visual Acuity' },
          { prefix: 'bestcorrectedvisualacuity', label: 'Best Corrected Visual Acuity' }
        ].map((field) => (
          <React.Fragment key={field.prefix}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">{field.label}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Distance OD"
                name={`${field.prefix}DistanceOD`}
                value={formData[`${field.prefix}DistanceOD`] || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Distance OS"
                name={`${field.prefix}DistanceOS`}
                value={formData[`${field.prefix}DistanceOS`] || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Near OD"
                name={`${field.prefix}NearOD`}
                value={formData[`${field.prefix}NearOD`] || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Near OS"
                name={`${field.prefix}NearOS`}
                value={formData[`${field.prefix}NearOS`] || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePreviousPage}
            sx={{ marginRight: 2 }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextPage}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionF;
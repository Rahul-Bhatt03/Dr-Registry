import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { saveSectionHData } from "../features/sectionSlice";
import { updateDrRegistryInfo } from "../features/updateFormSlice.js"; // Import the update action

const SectionH = ({
  handleNextClick,
  handlePreviousClick,
  setSelectedAlphabet,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sectionHData = useSelector((state) => state.form.sectionH);
  const sectionGData = useSelector((state) => state.form.sectionG);
  const sectionFData = useSelector((state) => state.form.sectionF);
  const sectionEData = useSelector((state) => state.form.sectionE);
  const sectionDData = useSelector((state) => state.form.sectionD);
  const sectionBData = useSelector((state) => state.form.sectionB);
  const sectionCData = useSelector((state) => state.form.sectionC);

  // Retrieve patientInfoId and DrRegistryId from Redux store or localStorage
  const patientInfoId = parseInt(localStorage.getItem("currentpatientInfoId"));
  const id = parseInt(
    sectionBData.DrRegistryId || localStorage.getItem("DrRegistryId")
  );

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (sectionHData) {
      setFormData(sectionHData);
    }
  }, [sectionHData]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [field]: value,
      };

      dispatch(saveSectionHData(updatedData));
      return updatedData;
    });
  };

  const handleUpdateRegistry = async () => {
    try {
      dispatch(saveSectionHData(formData));

      const payload = {
        ...sectionBData,
        ...sectionCData,
        ...sectionDData,
        ...sectionEData,
        ...sectionFData,
        ...sectionGData,
        ...formData,
        patientInfoId,
        id,
      };
      console.log("Section H Payload:", payload);
      // Dispatch API call to update DrRegistry
      await dispatch(updateDrRegistryInfo({ registryData: payload }));
      const nextAlphabet = "Fundus-Examination";
      setSelectedAlphabet(nextAlphabet);
      localStorage.setItem("selectedAlphabet", nextAlphabet);
      navigate(`/section-${nextAlphabet}`);

      handleNextClick();
    } catch (error) {
      console.error("Error updating DrRegistry:", error);
    }
  };

  const renderRadioGroup = (title, prefix) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" marginBottom={2}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {["OD", "OS"].map((eye) => (
          <Grid key={eye} item xs={12} sm={6}>
            <Typography variant="body2" marginBottom={1}>
              {eye}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup row>
                <FormControlLabel
                  value="normal"
                  control={<Radio />}
                  label="Normal"
                  checked={formData[`${prefix}${eye}Normal`] === true}
                  onChange={() => {
                    handleInputChange(`${prefix}${eye}Normal`, true);
                    handleInputChange(`${prefix}${eye}Abnormal`, false);
                    handleInputChange(`${prefix}${eye}AbnormalDetails`, null);
                  }}
                />
                <FormControlLabel
                  value="abnormal"
                  control={<Radio />}
                  label="Abnormal"
                  checked={formData[`${prefix}${eye}Abnormal`] === true}
                  onChange={() => {
                    handleInputChange(`${prefix}${eye}Normal`, false);
                    handleInputChange(`${prefix}${eye}Abnormal`, true);
                  }}
                />
              </RadioGroup>
              {formData[`${prefix}${eye}Abnormal`] && (
                <TextField
                  fullWidth
                  label="Specify abnormal details"
                  variant="outlined"
                  value={formData[`${prefix}${eye}AbnormalDetails`] || null}
                  onChange={(e) =>
                    handleInputChange(
                      `${prefix}${eye}AbnormalDetails`,
                      e.target.value
                    )
                  }
                />
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  const renderCataractSection = (title, field, typeField) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" marginBottom={2}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {["OD", "OS"].map((eye) => (
          <Grid key={eye} item xs={12} sm={6}>
            <Typography variant="body2" marginBottom={1}>
              {eye}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup row>
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                  checked={formData[`${field}${eye}`] === true}
                  onChange={() => {
                    handleInputChange(`${field}${eye}`, true);
                  }}
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                  checked={formData[`${field}${eye}`] === false}
                  onChange={() => {
                    handleInputChange(`${field}${eye}`, false);
                    handleInputChange(`${typeField}${eye}`, null);
                  }}
                />
              </RadioGroup>
              {formData[`${field}${eye}`] && typeField && (
                <TextField
                  fullWidth
                  label={`Specify ${eye} Cataract Type`}
                  variant="outlined"
                  value={formData[`${typeField}${eye}`] || null}
                  onChange={(e) =>
                    handleInputChange(`${typeField}${eye}`, e.target.value)
                  }
                />
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

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
      <Typography variant="h6" marginBottom={4}>
        Section H: Slit Lamp Examination
      </Typography>
      <Grid container spacing={4}>
        {renderRadioGroup("Lid", "isODLid")}
        {renderRadioGroup("Conjunctiva", "isODConjunctiva")}
        {renderRadioGroup("Sclera", "isODSclera")}
        {renderRadioGroup("Corneal", "isODCorneal")}
        {renderRadioGroup("Anterior Chamber", "isODAnteriorChamber")}
        {renderRadioGroup("Iris", "isODIris")}
        {renderRadioGroup("Lens", "isODLens")}
        {renderCataractSection("Cataract", "isODCataract", "odCataractType")}
        {renderCataractSection("Mature Cataract", "isOSMatureCataract", null)}
        {renderCataractSection(
          "Complicated Cataract",
          "isOSComplicatedCataract",
          null
        )}
        {renderRadioGroup("Vitreous", "isODVitreous")}

        <Grid item xs={12}>
          <Typography variant="subtitle1" marginBottom={2}>
            Other Slit Lamp Findings
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Specify other findings"
            variant="outlined"
            value={formData.otherSlitlampExamination || null}
            onChange={(e) =>
              handleInputChange("otherSlitlampExamination", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handlePreviousClick}
          >
            Previous Page
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={async () => {
              // Update DrRegistry info before navigating to the next page
              await handleUpdateRegistry();
              handleNextClick();
            }}
          >
            Next Page
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionH;

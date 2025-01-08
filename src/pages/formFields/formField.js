export const formSections = [
  {
    title: "Diabetic Retinopathy",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isDiabeticRetinopathyOD",
     storeKeyOS: "isDiabeticRetinopathyOS"
  },
  {
    title: "Severity (NPDR)",
    type: "radio",
    options: [
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderative" },
      { value: 3, label: "Severe" },
      { value: 4, label: "Very Severe" }
    ],
    storeKeyOD: "diabeticRetinopathyODSeverityNPDR",
    storeKeyOS: "diabeticRetinopathyODSeverityNPDR"

  },
  {
    title: "Severity (PDR)",
    type: "radio",
    options: [
      { value: 1, label: "Early" },
      { value: 2, label: "High Risk" },
      { value: 3, label: "Advanced" }
    ],
    storeKeyOD: "diabeticRetinopathyODSeverityPDR",
    storeKeyOS: "diabeticRetinopathyOSSeverityPDR"

  },
  {
    title: "Clinical Macular Findings",
    type: "radio",
    options: [
      { value: 1, label: "Clinically Significant Macular Edema" },
      { value: 2, label: "Clinically Not Significant Macular Edema" },
      { value: 3, label: "No Macular Edema" }
    ],
    storeKeyOD: "diabeticRetinopathyODClinicalMacularFindings",
    storeKeyOS: "diabeticRetinopathyOSClinicalMacularFindings"

  },
  {
    title: "Macular Edema (OCT Finding)",
    type: "radio",
    options: [
      { value: 1, label: "Center Involving" },
      { value: 2, label: "Center Not Involving" },
      { value: 3, label: "NoMacularEdema" }

    ],
    storeKeyOD: "diabeticRetinopathyODMacularEdemaOCTFinding",
    storeKeyOS: "diabeticRetinopathyOSMacularEdemaOCTFinding"

  },
  {
    title: "Ocular Treatment for DR",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isDiabeticRetinopathyODOcularTreatmentforDR",
    storeKeyOS: "isDiabeticRetinopathyOSOcularTreatmentforDR"

  },
  {
    title: "Ocular Treatment DR (LASER)",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isDiabeticRetinopathyODOcularTreatmentforDRLaser",
    storeKeyOS: "isDiabeticRetinopathyOSOcularTreatmentforDRLaser"

  },
  {
    title: "Specify LASER Type",
    type: "radio",
    options: [
      { value: parseInt(1), label: "Focal" },
      { value: parseInt(2), label: "PRP" },
      { value: parseInt(3), label: "Both Focal and PRP" }
    ],
    storeKey: "laserType"
  },
  {
    title: "Fundus Photograph",
    type: "radio",
    options: [
      { value: true, label: "Done" },
      { value: false, label: "Not done" }
    ],
    storeKeyOD: "odfundusPhotograph",
    storeKeyOS: "osfundusPhotograph"

  },
  {
    title: "Macular OCT",
    type: "radio",
    options: [
      { value: true, label: "Done" },
      { value: false, label: "Not done" }
    ],
    storeKeyOD: "odMacularOCT",
    storeKeyOS: "osMacularOCT",

  },
  {
    title: "Combined Surgery (Cataract+Vitrectomy)",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODCOmbinedSurgery",
    storeKeyOS: "isOSCOmbinedSurgery"
  },
  {
    title: "Intra Ocular Lens",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODIntraOcularLens",
    storeKeyOS: "isOSIntraOcularLens"
  },
  {
    title: "Immediate Anti VEGF before surgery (3 to 5 days prior to PPV)",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODImmediateAntiVEGFbeforesurgery",
    storeKeyOS: "isOSImmediateAntiVEGFbeforesurgery"
  },
  {
    title: "Fundus Photograph",
    type: "radio",
    options: [
      { value: true, label: "Done" },
      { value: false, label: "Not done" }
    ],
    storeKeyOD: "odFundusphotograph",
    storeKeyOS: "osFundusphotograph"
  },
  {
    title: "Fundus Findings",
    type: "text",
    storeKeyOD: "odFundusFindings",
    storeKeyOS: "osFundusFindings"
  },
  {
    title: "Fundus Photograph Upload",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODFundusphotographUpload",
    storeKeyOS: "isOSFundusphotographUpload"
  },
  {
    title: "Macular OCT",
    type: "radio",
    options: [
      { value: true, label: "Done" },
      { value: false, label: "Not done" }
    ],
    storeKeyOD: "odMacularOCT",
    storeKeyOS: "osMacularOCT"
  },
  {
    title: "Macular OCT Findings",
    type: "text",
    storeKeyOD: "odMacularOCTFindings",
    storeKeyOS: "osMacularOCTFindings"
  },
  {
    title: "Macular OCT Upload",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODMacularOCTUpload",
    storeKeyOS: "isOSMacularOCTUpload"
  },
  {
    title: "FFA",
    type: "radio",
    options: [
      { value: true, label: "Done" },
      { value: false, label: "Not done" }
    ],
    storeKeyOD: "odffa",
    storeKeyOS: "osffa"
  },
  {
    title: "FFA Findings",
    type: "text",
    storeKeyOD: "odffaFindings",
    storeKeyOS: "osffaFindings"
  },
  {
    title: "FFA Upload",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODFFAUpload",
    storeKeyOS: "isOSFFAUpload"
  },
  {
    title: "OCT A",
    type: "radio",
    options: [
      { value: true, label: "Done" },
      { value: false, label: "Not done" }
    ],
    storeKeyOD: "odocta",
    storeKeyOS: "osocta"
  },
  {
    title: "OCT A Findings",
    type: "text",
    storeKeyOD: "odoctaFindings",
    storeKeyOS: "osoctaFindings"
  },
  {
    title: "OCT A Upload",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ],
    storeKeyOD: "isODOCTAUpload",
    storeKeyOS: "isOSOCTAUpload"
  }
];

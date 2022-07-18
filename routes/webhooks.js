export default const data= {
    computed: {
      age: {
        data: 28
      },
      isDocumentExpired: {
        data: {
          national-id: false
        }
      }
    },
    documents: [
      {
        country: "KE",
        region: null,
        type: "national-id",
        steps: [
          {
            status: 200,
            id: "kenyan-ecitizen-validation",
            error: null,
            data: {
              documentNumber: "31320509",
              fullName: "SOLOMON GITHIRA"
            }
          },
          {
            status: 200,
            id: "age-check",
            data: {
              age: 28,
              ageThreshold: 18,
              underage: false
            },
            error: null
          },
          {
            status: 200,
            id: "alteration-detection",
            error: null
          },
          {
            status: 200,
            id: "facematch",
            data: {
              score: 100
            },
            error: null
          },
          {
            status: 200,
            id: "template-matching",
            error: null
          },
          {
            status: 200,
            id: "document-reading",
            data: {
              fullName: {
                value: "SOLOMON MUGWIMA GITHIRA",
                label: "Name",
                required: true
              },
              emissionDate: {
                value: "2012-12-24",
                label: "Emission Date",
                required: false
              },
              documentNumber: {
                value: "31320509",
                label: "Document Number",
                required: true
              },
              dateOfBirth: {
                value: "1994-06-17",
                label: "Day of Birth",
                required: true
              },
              expirationDate: {
                value: "2070-12-31",
                label: "Date of Expiration",
                required: false
              },
              documentType: {
                value: "ID",
                label: "Document Type",
                required: false
              },
              firstName: {
                value: "SOLOMON MUGWIMA",
                label: "First Name",
                required: false
              },
              issueCountry: {
                value: "KYA",
                label: "Issue Country",
                required: false
              },
              optional2: {
                value: "234918838",
                label: "Optional 2",
                required: false
              },
              sex: {
                value: "M",
                label: "Sex",
                required: false
              },
              surname: {
                value: "GITHIRA",
                label: "Surname",
                required: false
              }
            },
            error: null
          },
          {
            status: 200,
            id: "watchlists",
            error: null
          }
        ],
        fields: {
          dateOfBirth: {
            value: "1994-06-17"
          },
          documentNumber: {
            value: "31320509"
          },
          documentType: {
            value: "ID"
          },
          emissionDate: {
            value: "2012-12-24"
          },
          expirationDate: {
            value: "2070-12-31"
          },
          firstName: {
            value: "SOLOMON MUGWIMA"
          },
          fullName: {
            value: "SOLOMON MUGWIMA GITHIRA"
          },
          issueCountry: {
            value: "KYA"
          },
          optional2: {
            value: "234918838"
          },
          sex: {
            value: "M"
          },
          surname: {
            value: "GITHIRA"
          }
        },
        photos: [
          "https://media.getmati.com/file?location=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlTmFtZSI6IjBmZDI4NGFmLWIwNDMtNDIwMy04ZDYxLWE4YmNmNzdhNWZlYy5qcGVnIiwiZm9sZGVyIjoiZG9jdW1lbnQiLCJpYXQiOjE2NTY2NzA5NzIsImV4cCI6MTY1Njc1NzM3MiwiYXVkIjoiYzkyNmQ1MDItYmEzYi00N2FhLTg0YjItZjJmZGNiODQxYjdlIn0.lTAa3Zru08RKnnuGKSqcn5Rcvnz4V70EG81679Yx764",
          "https://media.getmati.com/file?location=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlTmFtZSI6IjQxNDFiZmViLTA3OGItNDRhZS1hZDNlLTU4YjAzYjE0MTM4OC5qcGVnIiwiZm9sZGVyIjoiZG9jdW1lbnQiLCJpYXQiOjE2NTY2NzA5NzIsImV4cCI6MTY1Njc1NzM3MiwiYXVkIjoiYzkyNmQ1MDItYmEzYi00N2FhLTg0YjItZjJmZGNiODQxYjdlIn0.Lw3GjCevtMzpmbrY-GNEQr2XdtkrgO0kP_Q9gGuwka8"
        ]
      }
    ],
    expired: false,
    flow: {
      id: "62bc6671e1ec51001cbe0466",
      name: "hotel.veriphy.co"
    },
    identity: {
      status: "verified"
    },
    steps: [
      {
        status: 200,
        id: "selfie",
        data: {
          selfiePhotoUrl: "https://media.getmati.com/file?location=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlTmFtZSI6IjhkNDZhOWY1LTA5OTgtNDkwZi1iNWY3LWI3MGQzY2E2MDZiMC5qcGVnIiwiZm9sZGVyIjoiZG9jdW1lbnQiLCJpYXQiOjE2NTY2NzA5NzIsImV4cCI6MTY1Njc1NzM3MiwiYXVkIjoiYzkyNmQ1MDItYmEzYi00N2FhLTg0YjItZjJmZGNiODQxYjdlIn0.3LeeOuqRSb3HIHhc-uz_c9Ixyzae7s3E_1b1xbYmTFU"
        },
        error: null
      }
    ],
    id: "62beca341198f7001c2875fd",
    deviceFingerprint: {
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      browser: {
        name: "Chrome",
        version: "103.0.0.0",
        major: "103"
      },
      engine: {
        name: "Blink",
        version: "103.0.0.0"
      },
      os: {
        name: "Windows",
        version: "10"
      },
      cpu: {
        architecture: "amd64"
      },
      ip: "197.248.61.219",
      vpnDetectionEnabled: false
    },
    hasProblem: false
  }
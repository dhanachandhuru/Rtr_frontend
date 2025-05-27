import React from 'react';
import { Document, Page, Text, Image, StyleSheet } from '@react-pdf/renderer';

// Register a font
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    width: 'auto',
    height: 200,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const generateClubReportPdf = (data) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        ~ Club Report ~
      </Text>
      <Text style={styles.title}>{data.reportName}</Text>
      <Text style={styles.text}>{"Description: "+data.description}</Text>
      <Text style={styles.text}>{"Rotaractors Attended: "+ data.rotractorsAttended}</Text>
      <Text style={styles.text}>{"Rotarians Attended: "+ data.rotariansAttended}</Text>
      <Text style={styles.text}>{"Visiting Rotaractors: "+data.visitingRotractors}</Text>
      <Text style={styles.text}>{"Guests: "+ data.guests}</Text>
      <Text style={styles.text}><h6>Beneficiaries:</h6> {data.beneficiaries}</Text>
      <Text style={styles.text}><h6>Report Type:</h6> {data.reportType}</Text>
      <Text style={styles.text}><h6>Month:</h6> {data.month}</Text>
      <Text style={styles.text}><h6>Avenue:</h6> {data.avenue}</Text>
      <Text style={styles.text}><h6>Created At:</h6> {new Date(data.createdAt).toLocaleString()}</Text>
      <Text style={styles.text}><h6>Updated At:</h6> {new Date(data.updatedAt).toLocaleString()}</Text>
      <Text style={styles.text}><h6>Club Name:</h6> {data.clubName}</Text>
      <Text style={styles.title}>Photographs</Text>
      {data.photographs.map((photo, index) => (
        <Image key={index} style={styles.image} src={photo} />
      ))}
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default generateClubReportPdf;
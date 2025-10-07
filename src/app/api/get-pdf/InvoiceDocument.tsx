import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// pdf styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 150,
  },
  headerInfo: {
    textAlign: 'right',
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  billTo: {
    textAlign: 'right',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 300,
    marginBottom: 4,
  },
  image: {
    width: 250,
    marginBottom: 15,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginTop: 20,
  },
  table: {
    width: 'auto',
    marginTop: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eee',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    backgroundColor: '#eee',
    padding: 5,
    textAlign: 'left',
  },
  tableCol: {
    width: '20%',
    padding: 5,
  },
  total: {
    textAlign: 'right',
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const InvoiceDocument = ({ data }: { data: any }) => {
  const {
    listingTitle: title,
    listingDescription: description,
    sellingPrice: price,
    address,
    imageUrls,
    isPickupAvailable,
    secondaryId,
    createdAt,
    name,
    email,
    logo
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headerInfo}>
            <Text>Invoice #: {secondaryId}</Text>
            <Text>Listing Created: {new Date(createdAt).toLocaleDateString()}</Text>
            <Text>Invoice Created: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.companyInfo}>
          <View>
            <Text>Garage Technologies, Inc.</Text>
            <Text>(201) 293-7164</Text>
            <Text>support@withgarage.com</Text>
          </View>
          <View style={styles.billTo}>
            <Text>Bill to:</Text>
            <Text>{name}</Text>
            <Text>{email}</Text>
          </View>
        </View>

        <Image style={styles.image} src={imageUrls[0]} />
        <Text style={styles.title}>{title}</Text>
        <Text>Located in {address.state}{isPickupAvailable ? ', pickup available' : ''}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={{...styles.tableColHeader, width: '10%'}}>Qty</Text>
            <Text style={{...styles.tableColHeader, width: '70%'}}>Description</Text>
            <Text style={{...styles.tableColHeader, width: '20%', textAlign: 'right'}}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={{...styles.tableCol, width: '10%'}}>1</Text>
            <Text style={{...styles.tableCol, width: '70%'}}>{title}</Text>
            <Text style={{...styles.tableCol, width: '20%', textAlign: 'right'}}>{formatPrice(price)}</Text>
          </View>
        </View>

        <Text style={styles.total}>Total (USD): {formatPrice(price)}</Text>

        <Text style={styles.footer}>
          Garage Technologies, Inc. | (201) 293-7164 | support@withgarage.com
        </Text>
      </Page>
    </Document>
  );
};
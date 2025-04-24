import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Linking
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Contacts from 'expo-contacts';

// Components
import ActionButton from '../components/ActionButton';

// Utils
import { getQRCodeTypeIcon, getQRCodeTypeLabel } from '../utils/qrCodeParser';
import { formatDate } from '../utils/helpers';

// Types
type RootStackParamList = {
  Result: { content: string; type: string };
};

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation();
  const { content, type } = route.params;
  const [parsedContent, setParsedContent] = useState<any>(null);

  // Parse content based on type
  useEffect(() => {
    try {
      switch (type) {
        case 'URL':
          setParsedContent({ url: content });
          break;
        case 'WIFI':
          // Example format: WIFI:S:NetworkName;T:WPA;P:Password;;
          const ssid = content.match(/S:(.*?);/)?.[1] || '';
          const password = content.match(/P:(.*?);/)?.[1] || '';
          const securityType = content.match(/T:(.*?);/)?.[1] || '';
          setParsedContent({ ssid, password, securityType });
          break;
        case 'CONTACT':
          // Simplified parsing for vCard
          const name = content.match(/FN:(.*?)\\n/)?.[1] || content.match(/N:(.*?)\\n/)?.[1] || '';
          const phone = content.match(/TEL:(.*?)\\n/)?.[1] || '';
          const email = content.match(/EMAIL:(.*?)\\n/)?.[1] || '';
          setParsedContent({ name, phone, email });
          break;
        case 'GEO':
          // Format: geo:latitude,longitude
          const [lat, lng] = content.replace('geo:', '').split(',');
          setParsedContent({ latitude: lat, longitude: lng });
          break;
        case 'SMS':
          // Format: sms:phone:message
          const smsPhone = content.match(/sms:(.*?):/)?.[1] || '';
          const smsMessage = content.split(':').slice(2).join(':') || '';
          setParsedContent({ phone: smsPhone, message: smsMessage });
          break;
        case 'PHONE':
          // Format: tel:phone
          const phoneNumber = content.replace('tel:', '');
          setParsedContent({ phone: phoneNumber });
          break;
        case 'EMAIL':
          // Format: mailto:email?subject=subject&body=body
          const emailAddress = content.replace('mailto:', '').split('?')[0];
          const subject = content.match(/subject=(.*?)(&|$)/)?.[1] || '';
          const body = content.match(/body=(.*?)(&|$)/)?.[1] || '';
          setParsedContent({ email: emailAddress, subject, body });
          break;
        default:
          setParsedContent({ text: content });
      }
    } catch (error) {
      console.error('Error parsing content:', error);
      setParsedContent({ text: content });
    }
  }, [content, type]);

  // Copy content to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied', 'Content copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  // Handle URL opening
  const openURL = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  // Handle web search
  const searchWeb = async (query: string) => {
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      await Linking.openURL(searchUrl);
    } catch (error) {
      console.error('Error searching web:', error);
      Alert.alert('Error', 'Failed to search the web');
    }
  };

  // Handle Wi-Fi connection
  const connectToWifi = async (ssid: string, password: string, securityType: string) => {
    try {
      // On iOS and Android, we can only show instructions as direct connection is limited
      Alert.alert(
        'Connect to Wi-Fi',
        `Network: ${ssid}\nPassword: ${password}\n\nPlease go to your device's Wi-Fi settings to connect.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Copy Password', 
            onPress: () => copyToClipboard(password)
          },
          { 
            text: 'Open Settings', 
            onPress: () => Linking.openSettings()
          }
        ]
      );
    } catch (error) {
      console.error('Error connecting to Wi-Fi:', error);
      Alert.alert('Error', 'Failed to connect to Wi-Fi');
    }
  };

  // Handle adding contact
  const addContact = async (name: string, phone: string, email: string) => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Contact permission is required to add contacts',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const contact = {
        [Contacts.Fields.FirstName]: name,
        [Contacts.Fields.PhoneNumbers]: [{ number: phone }],
        [Contacts.Fields.Emails]: [{ email: email }]
      };

      await Contacts.addContactAsync(contact);
      Alert.alert('Success', 'Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact');
    }
  };

  // Handle showing location on map
  const showOnMap = async (latitude: string, longitude: string) => {
    try {
      const url = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to Google Maps
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        await Linking.openURL(googleMapsUrl);
      }
    } catch (error) {
      console.error('Error opening map:', error);
      Alert.alert('Error', 'Failed to open map');
    }
  };

  // Handle sending SMS
  const sendSMS = async (phone: string, message: string) => {
    try {
      const url = `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error sending SMS:', error);
      Alert.alert('Error', 'Failed to send SMS');
    }
  };

  // Handle making phone call
  const callPhone = async (phone: string) => {
    try {
      const url = `tel:${phone}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error making call:', error);
      Alert.alert('Error', 'Failed to make call');
    }
  };

  // Handle composing email
  const composeEmail = async (email: string, subject: string, body: string) => {
    try {
      const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error composing email:', error);
      Alert.alert('Error', 'Failed to compose email');
    }
  };

  // Render content preview based on type
  const renderContentPreview = () => {
    if (!parsedContent) return null;

    switch (type) {
      case 'URL':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>URL</Text>
            <Text style={styles.previewContent} numberOfLines={3}>
              {parsedContent.url}
            </Text>
          </View>
        );
      case 'WIFI':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Wi-Fi Network</Text>
            <Text style={styles.previewContent}>SSID: {parsedContent.ssid}</Text>
            <Text style={styles.previewContent}>
              Password: {parsedContent.password ? '••••••••' : 'None'}
            </Text>
            <Text style={styles.previewContent}>
              Security: {parsedContent.securityType || 'Unknown'}
            </Text>
          </View>
        );
      case 'CONTACT':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Contact</Text>
            <Text style={styles.previewContent}>Name: {parsedContent.name || 'N/A'}</Text>
            <Text style={styles.previewContent}>Phone: {parsedContent.phone || 'N/A'}</Text>
            <Text style={styles.previewContent}>Email: {parsedContent.email || 'N/A'}</Text>
          </View>
        );
      case 'GEO':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Location</Text>
            <Text style={styles.previewContent}>
              Latitude: {parsedContent.latitude}
            </Text>
            <Text style={styles.previewContent}>
              Longitude: {parsedContent.longitude}
            </Text>
          </View>
        );
      case 'SMS':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>SMS</Text>
            <Text style={styles.previewContent}>To: {parsedContent.phone}</Text>
            <Text style={styles.previewContent} numberOfLines={3}>
              Message: {parsedContent.message || 'N/A'}
            </Text>
          </View>
        );
      case 'PHONE':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Phone</Text>
            <Text style={styles.previewContent}>{parsedContent.phone}</Text>
          </View>
        );
      case 'EMAIL':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Email</Text>
            <Text style={styles.previewContent}>To: {parsedContent.email}</Text>
            <Text style={styles.previewContent}>
              Subject: {parsedContent.subject || 'N/A'}
            </Text>
            <Text style={styles.previewContent} numberOfLines={3}>
              Body: {parsedContent.body || 'N/A'}
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Text</Text>
            <Text style={styles.previewContent} numberOfLines={5}>
              {parsedContent.text}
            </Text>
          </View>
        );
    }
  };

  // Render action buttons based on type
  const renderActionButtons = () => {
    if (!parsedContent) return null;

    switch (type) {
      case 'URL':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="open"
              label="Open URL"
              onPress={() => openURL(parsedContent.url)}
            />
            <ActionButton
              icon="copy"
              label="Copy URL"
              onPress={() => copyToClipboard(parsedContent.url)}
            />
          </View>
        );
      case 'WIFI':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="wifi"
              label="Connect to Wi-Fi"
              onPress={() => connectToWifi(
                parsedContent.ssid,
                parsedContent.password,
                parsedContent.securityType
              )}
            />
            <ActionButton
              icon="copy"
              label="Copy Password"
              onPress={() => copyToClipboard(parsedContent.password)}
            />
            <ActionButton
              icon="copy"
              label="Copy Network Details"
              onPress={() => copyToClipboard(
                `SSID: ${parsedContent.ssid}\nPassword: ${parsedContent.password}\nSecurity: ${parsedContent.securityType}`
              )}
            />
          </View>
        );
      case 'CONTACT':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="contact"
              label="Add Contact"
              onPress={() => addContact(
                parsedContent.name,
                parsedContent.phone,
                parsedContent.email
              )}
            />
            <ActionButton
              icon="copy"
              label="Copy Details"
              onPress={() => copyToClipboard(
                `Name: ${parsedContent.name}\nPhone: ${parsedContent.phone}\nEmail: ${parsedContent.email}`
              )}
            />
            {parsedContent.phone && (
              <ActionButton
                icon="phone"
                label="Call Number"
                onPress={() => callPhone(parsedContent.phone)}
              />
            )}
            {parsedContent.email && (
              <ActionButton
                icon="email"
                label="Send Email"
                onPress={() => composeEmail(parsedContent.email, '', '')}
              />
            )}
          </View>
        );
      case 'GEO':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="map"
              label="Show on Map"
              onPress={() => showOnMap(
                parsedContent.latitude,
                parsedContent.longitude
              )}
            />
            <ActionButton
              icon="copy"
              label="Copy Coordinates"
              onPress={() => copyToClipboard(
                `${parsedContent.latitude},${parsedContent.longitude}`
              )}
            />
          </View>
        );
      case 'SMS':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="sms"
              label="Send SMS"
              onPress={() => sendSMS(parsedContent.phone, parsedContent.message)}
            />
            <ActionButton
              icon="copy"
              label="Copy Number"
              onPress={() => copyToClipboard(parsedContent.phone)}
            />
            <ActionButton
              icon="copy"
              label="Copy Message"
              onPress={() => copyToClipboard(parsedContent.message)}
            />
          </View>
        );
      case 'PHONE':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="phone"
              label="Call Number"
              onPress={() => callPhone(parsedContent.phone)}
            />
            <ActionButton
              icon="copy"
              label="Copy Number"
              onPress={() => copyToClipboard(parsedContent.phone)}
            />
          </View>
        );
      case 'EMAIL':
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="email"
              label="Compose Email"
              onPress={() => composeEmail(
                parsedContent.email,
                parsedContent.subject,
                parsedContent.body
              )}
            />
            <ActionButton
              icon="copy"
              label="Copy Address"
              onPress={() => copyToClipboard(parsedContent.email)}
            />
            {(parsedContent.subject || parsedContent.body) && (
              <ActionButton
                icon="copy"
                label="Copy Subject/Body"
                onPress={() => copyToClipboard(
                  `Subject: ${parsedContent.subject}\nBody: ${parsedContent.body}`
                )}
              />
            )}
          </View>
        );
      default:
        return (
          <View style={styles.actionsContainer}>
            <ActionButton
              icon="copy"
              label="Copy Text"
              onPress={() => copyToClipboard(parsedContent.text)}
            />
            <ActionButton
              icon="search"
              label="Search Web"
              onPress={() => searchWeb(parsedContent.text)}
            />
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Type indicator */}
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>{getQRCodeTypeIcon(type)}</Text>
          <Text style={styles.typeLabel}>{getQRCodeTypeLabel(type)}</Text>
        </View>

        {/* Content preview */}
        {renderContentPreview()}

        {/* Action buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {renderActionButtons()}
        </View>

        {/* Raw content */}
        <View style={styles.rawSection}>
          <Text style={styles.sectionTitle}>Raw Content</Text>
          <View style={styles.rawContainer}>
            <Text style={styles.rawContent}>{content}</Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={() => copyToClipboard(content)}
            >
              <Text style={styles.copyButtonText}>Copy Raw Content</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scan again button */}
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.scanAgainButtonText}>Scan Another Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  typeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  typeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  previewContent: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  rawSection: {
    marginBottom: 24,
  },
  rawContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rawContent: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanAgainButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ResultScreen;

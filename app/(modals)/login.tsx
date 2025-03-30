import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

enum Strategy {
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook'
}

const Page = () => { 
    useWarmUpBrowser();
    const router = useRouter();
    const { startSSOFlow } = useSSO();

    const onSelectAuth = async (strategy: Strategy) => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({ strategy });
        
        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
          // Use dismiss() instead of back() for modal navigation
          router.dismiss();
          // Alternatively, you could navigate to a specific screen:
          // router.replace('/(tabs)/home');
        }
      } catch (error: any) {
        console.error('SSO error:', error.errors?.[0]?.message || error.message);
      }
    }

    return (
      <View style={styles.container}>
        <TextInput 
          autoCapitalize='none' 
          placeholder='Email' 
          style={[defaultStyles.inputField, {marginBottom: 30}]} 
        />
        
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.separatorView}>
          <View style={styles.separatorLine} />
          <Text style={styles.seperator}>or</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={{ gap: 20 }}>
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name='call-outline' size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Phone</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.btnOutline} 
            onPress={() => onSelectAuth(Strategy.Apple)}
          >
            <AntDesign name='apple1' size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Apple</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.btnOutline} 
            onPress={() => onSelectAuth(Strategy.Google)}
          >
            <AntDesign name='google' size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.btnOutline} 
            onPress={() => onSelectAuth(Strategy.Facebook)}
          >
            <AntDesign name='facebook-square' size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26
  },
  separatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30
  },
  separatorLine: {
    flex: 1,
    borderBottomColor: '#000',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.grey
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb'
  }
})

export default Page
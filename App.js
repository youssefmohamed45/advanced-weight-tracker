import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, useColorScheme, Alert, View, ActivityIndicator, Platform } from 'react-native';
import * as Updates from 'expo-updates'; 
import { supabase } from './supabaseClient'; 

// --- Screen Imports ---
import IndexScreen from "./Index";
import WeightTracker from "./weighttracker";
import FoodScreen from "./food"; 
import WaterTrackingScreen from "./water";
import StepsScreen from "./steps";
import WeeklyStepsScreen from "./weeklysteps";
import MonthlyStepsScreen from "./Monthlysteps";
import SettingsScreen from "./setting";
import ReportsScreen from "./reports";
import AboutScreen from "./about";
import SignUp from "./signup";
import LoginScreen from "./LoginScreen";
import VerificationCodeScreen from "./VerificationCodeScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";
import SplashScreen from "./SplashScreen"; 
import TipsScreen from "./tips";
import ProfileScreen from "./profile";
import EditProfileScreen from "./editprofile";
import AchievementsScreen from "./Achievements";
import DistanceDetailsScreen from './Distance'; 
import CaloriesDetailsScreen from './Calories';
import ActiveTimeDetailsScreen from './ActiveTime';
import PremiumScreen from './PremiumScreen'; 

import { enableDailyNotifications, disableDailyNotifications } from './notificationService';
import { APP_LANGUAGE_KEY, APP_DARK_MODE_KEY, INTENDED_ROUTE_AFTER_RESTART_KEY, appTranslations as globalAppTranslations } from './constants'; 

const Stack = createStackNavigator();

const defaultGlobalAppTranslations = {
    en: { restartTitle: "Restart Required", restartMessage: "The app will reload to apply changes.", okButton: "OK" },
    ar: { restartTitle: "تغيير اللغة", restartMessage: "سيتم إعادة تحميل الواجهة لتطبيق اللغة الجديدة.", okButton: "حسناً" }
};
const effectiveGlobalAppTranslations = globalAppTranslations || defaultGlobalAppTranslations;

const RootStack = ({ language, darkMode, handlers, initialRoute }) => (
  <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Index">
        {(props) => <IndexScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="SignUp">
        {(props) => <SignUp {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword">
        {(props) => <ForgotPasswordScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="VerificationCode">
        {(props) => <VerificationCodeScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="ResetPassword">
        {(props) => <ResetPasswordScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>

    <Stack.Screen name="Weight">
      {(props) => <WeightTracker {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Food">
      {(props) => <FoodScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Water">
      {(props) => <WaterTrackingScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Steps">
      {(props) => <StepsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="WeeklySteps">
      {(props) => <WeeklyStepsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="MonthlySteps">
      {(props) => <MonthlyStepsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Reports">
      {(props) => <ReportsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Tips">
      {(props) => <TipsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Achievements">
      {(props) => <AchievementsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Distance">
      {(props) => <DistanceDetailsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="Calories">
      {(props) => <CaloriesDetailsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="ActiveTime">
      {(props) => <ActiveTimeDetailsScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="PremiumScreen">
      {(props) => <PremiumScreen {...props} language={language} darkMode={darkMode} />}
    </Stack.Screen>
    <Stack.Screen name="profile">
      {(props) => <ProfileScreen {...props} language={language} darkMode={darkMode} navigateToPremium={() => props.navigation.navigate('PremiumScreen')} navigateToSettings={() => props.navigation.navigate('Setting')} navigateToAbout={() => props.navigation.navigate('About')} navigateToEditProfile={() => props.navigation.navigate('editprofile')} goBack={() => props.navigation.canGoBack() && props.navigation.goBack()} />}
    </Stack.Screen>
    <Stack.Screen name="editprofile">
      {(props) => <EditProfileScreen {...props} language={language} darkMode={darkMode} goBack={() => props.navigation.canGoBack() && props.navigation.goBack()} onSaveSuccess={() => { if(props.navigation.canGoBack()) props.navigation.goBack(); }} />}
    </Stack.Screen>
    <Stack.Screen name="About">
      {(props) => <AboutScreen {...props} language={language} darkMode={darkMode} goBack={() => props.navigation.canGoBack() && props.navigation.goBack()} />}
    </Stack.Screen>
    <Stack.Screen name="Setting">
      {(props) => (
        <SettingsScreen
          {...props}
          languageProp={language}
          changeLanguageProp={handlers.handleChangeLanguage}
          darkModeProp={darkMode}
          toggleDarkModeProp={handlers.handleToggleDarkMode}
          enableNotifications={async () => await enableDailyNotifications(language, effectiveGlobalAppTranslations)}
          disableNotifications={async () => await disableDailyNotifications(language, effectiveGlobalAppTranslations)}
          goBack={() => props.navigation.canGoBack() && props.navigation.goBack()}
        />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

const App = () => {
  const [session, setSession] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [appLanguage, setAppLanguage] = useState(I18nManager.isRTL ? 'ar' : 'en');
  const systemColorScheme = useColorScheme();
  const [isAppDarkMode, setIsAppDarkMode] = useState(systemColorScheme === 'dark');
  const navigationRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        let currentLang = I18nManager.isRTL ? 'ar' : 'en';
        const storedLang = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
        if (storedLang && ['ar', 'en'].includes(storedLang)) {
          currentLang = storedLang;
        }
        
        // ضبط الإتجاه عند بداية التشغيل فقط
        if (I18nManager.isRTL !== (currentLang === 'ar')) {
          I18nManager.allowRTL(currentLang === 'ar');
          I18nManager.forceRTL(currentLang === 'ar');
        }
        setAppLanguage(currentLang);

        let currentIsDark = systemColorScheme === 'dark';
        const storedDarkMode = await AsyncStorage.getItem(APP_DARK_MODE_KEY);
        if (storedDarkMode !== null) {
          currentIsDark = storedDarkMode === 'true';
        }
        setIsAppDarkMode(currentIsDark);

        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);

      } catch (e) {
        console.error("App Initialization Error:", e);
      } finally {
        setTimeout(() => {
          setIsAppReady(true);
        }, 2000);
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ الدالة المصححة والآمنة
  const handleChangeLanguage = useCallback(async (newLang) => {
    if (newLang === appLanguage) return;
    try {
      // 1. حفظ اللغة الجديدة
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, newLang);
      
      // 2. تحديث إعدادات الاتجاه
      const isAr = newLang === 'ar';
      I18nManager.allowRTL(isAr);
      I18nManager.forceRTL(isAr);

      // 3. التعامل مع إعادة التشغيل
      if (__DEV__) {
          // 🟢 وضع التطوير (Expo Go):
          // لا نقوم بإعادة التشغيل القسرية (Reload) لأنها تسبب كراش.
          // بدلاً من ذلك، نحدث الـ State فقط.
          // الـ key={appLanguage} في الأسفل سيجبر التطبيق على إعادة بناء الواجهة باللغة الجديدة.
          setAppLanguage(newLang);
          
          // ملاحظة: في Expo Go، قد لا ينقلب اتجاه النصوص (يمين/يسار) بشكل كامل
          // إلا إذا قمت بعمل Reload يدوي من قائمة المطورين، لكن النصوص ستتغير ولن يخرج التطبيق.
      } else {
          // 🔴 التطبيق النهائي (Production APK/IPA):
          // هنا نستخدم Updates.reloadAsync() لأنها آمنة وتضمن قلب الاتجاه بالكامل.
          const translations = effectiveGlobalAppTranslations[newLang] || effectiveGlobalAppTranslations['en'];
          Alert.alert(
            translations.restartTitle,
            translations.restartMessage,
            [{ 
                text: translations.okButton, 
                onPress: async () => {
                    try {
                        await Updates.reloadAsync();
                    } catch (e) {
                        // في حالة فشل الريلود، نعود للطريقة الآمنة
                        setAppLanguage(newLang);
                    }
                } 
            }],
            { cancelable: false }
          );
      }

    } catch (error) {
      console.error("Failed to change language", error);
    }
  }, [appLanguage]);

  const handleToggleDarkMode = useCallback(async (newDarkModeState) => {
    if (newDarkModeState === isAppDarkMode) return;
    try {
      await AsyncStorage.setItem(APP_DARK_MODE_KEY, String(newDarkModeState));
      setIsAppDarkMode(newDarkModeState);
    } catch (error) {
      console.error("Failed to toggle dark mode", error);
    }
  }, [isAppDarkMode]);
  
  const onNavigationReady = useCallback(async () => {
    if (!isAppReady) return;
    // التنقل للصفحة المحفوظة (إن وجدت)
  }, [isAppReady]);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  const initialRouteName = session && session.user ? "Weight" : "Index";

  return (
    <SafeAreaProvider>
      <NavigationContainer 
        ref={navigationRef} 
        onReady={onNavigationReady}
        // 👇 هذا المفتاح السحري: عند تغيير اللغة، يقوم React بتدمير وبناء التطبيق من جديد
        // هذا يحل محل الريلود في وضع التطوير ويمنع الكراش
        key={appLanguage} 
      >
          <RootStack 
            language={appLanguage} 
            darkMode={isAppDarkMode} 
            handlers={{ handleChangeLanguage, handleToggleDarkMode }} 
            initialRoute={initialRouteName}
          />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
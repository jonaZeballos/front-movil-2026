import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";

export default function App() {
  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      <StatusBar style="light" />
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <View style={tw`w-full max-w-sm rounded-3xl bg-white p-8`}>
          <Text style={tw`text-center text-sm font-semibold uppercase tracking-widest text-teal-700`}>
            Bienvenido
          </Text>
          <Text style={tw`mt-4 text-center text-4xl font-bold text-slate-900`}>
            Hola tu
          </Text>
          <Text style={tw`mt-4 text-center text-base leading-6 text-slate-600`}>
            Que bueno tenerte aqui. Tu app en Expo ya esta lista para comenzar.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

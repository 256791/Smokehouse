import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import store from './src/redux/Store';
import HomeView from './src/views/HomeView';

const theme = {
	...DefaultTheme,
	roundness: 2,
	colors: {
		...DefaultTheme.colors,
	},
};

const App = () => {
	return (
		<StoreProvider store={store}>
			<PaperProvider theme={theme}>
				<HomeView />
			</PaperProvider>
		</StoreProvider>
	);
};

export default App;

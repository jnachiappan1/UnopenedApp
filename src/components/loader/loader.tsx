import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import colors from "../../utils/colors";
import LoaderManager from "./loaderManager";

export function showLoader(args: any) {
  const ref: any = LoaderManager.getCurrent();
  if (!!ref) {
    ref.showLoader(args);
  }
}

export default class Loader extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: props.isLoading || false,
    };
  }
  //register and unregister component
  componentDidMount() {
    LoaderManager.register(this);
  }
  componentWillUnmount() {
    LoaderManager.unregister();
  }

  toggleVisibility() {
    this.setState({ isLoading: false });
  }

  showLoader(isLoading: any) {
    if (!!isLoading) {
      this.setState({ isLoading: isLoading });
      return;
    }
    this.setState({ isLoading: false });
  }

  render() {
    const { isLoading }: any = this.state;
    return (
      <Modal
        isVisible={isLoading}
        backdropOpacity={0.6}
        style={{ margin: 0 }}
        coverScreen={false}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
      >
        <View style={styles.container}>
          <ActivityIndicator size={"small"} color={colors.primary} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

import { useContext } from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  GetAddressButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getAddress,
  getSnap,
  isLocalSnap,
  sendHello,
  shouldDisplayReconnectButton,
} from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  console.log({ isMetaMaskReady });

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const getBitcoinAddress = async () => {
    const address = await getAddress();
    console.log({ address });
  };
  return (
    <Container>
      <Heading>
        Make BTC wallet address with <Span>Metamask Snaps</Span>
      </Heading>

      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {/* {!state.installedSnap && (*/}
        {/*  <Card*/}
        {/*    content={{*/}
        {/*      title: 'Connect',*/}
        {/*      description:*/}
        {/*        'Get started by connecting to and installing the example snap.',*/}
        {/*      button: (*/}
        {/*        <ConnectButton*/}
        {/*          onClick={handleConnectClick}*/}
        {/*          disabled={!isMetaMaskReady}*/}
        {/*        />*/}
        {/*      ),*/}
        {/*    }}*/}
        {/*    disabled={!isMetaMaskReady}*/}
        {/*  />*/}
        {/* )}*/}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Get All Bitcoin Address',
            description:
              'get all P2WPKH, P2SH-P2WPKH, P2RT and P2PKH address types',
            button: (
              <GetAddressButton
                onClick={async () => getBitcoinAddress()}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          // fullWidth={
          //   isMetaMaskReady &&
          //   Boolean(state.installedSnap) &&
          //   !shouldDisplayReconnectButton(state.installedSnap)
          // }
          fullWidth={true}
        />
        <Card
          content={{
            title: 'Get Native Segwit (P2WPKH) Address',
            description: 'get P2WPKH address type',
            button: (
              <GetAddressButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          // fullWidth={
          //   isMetaMaskReady &&
          //   Boolean(state.installedSnap) &&
          //   !shouldDisplayReconnectButton(state.installedSnap)
          // }
          // fullWidth={true}
        />
        <Card
          content={{
            title: 'Get Nested Segwit (P2SH-P2WPKH) Address',
            description: 'get P2SH-P2WPKH address type',
            button: (
              <GetAddressButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          // fullWidth={
          //   isMetaMaskReady &&
          //   Boolean(state.installedSnap) &&
          //   !shouldDisplayReconnectButton(state.installedSnap)
          // }
          // fullWidth={true}
        />
        <Card
          content={{
            title: 'Get Taproot (P2RT) Address',
            description: 'get P2RT address type',
            button: (
              <GetAddressButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          // fullWidth={
          //   isMetaMaskReady &&
          //   Boolean(state.installedSnap) &&
          //   !shouldDisplayReconnectButton(state.installedSnap)
          // }
          // fullWidth={true}
        />
        <Card
          content={{
            title: 'Get Legacy (P2PKH) Address',
            description: 'get P2PKH address type',
            button: (
              <GetAddressButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          // fullWidth={
          //   isMetaMaskReady &&
          //   Boolean(state.installedSnap) &&
          //   !shouldDisplayReconnectButton(state.installedSnap)
          // }
          // fullWidth={true}
        />

        {/* <Notice>*/}
        {/*  <p>*/}
        {/*    Please note that the <b>snap.manifest.json</b> and{' '}*/}
        {/*    <b>package.json</b> must be located in the server root directory and*/}
        {/*    the bundle must be hosted at the location specified by the location*/}
        {/*    field.*/}
        {/*  </p>*/}
        {/* </Notice>*/}
      </CardContainer>
    </Container>
  );
};

export default Index;

import {Avatar, Box, Container, Flex, HStack, Image, Menu, Portal, Text} from '@chakra-ui/react';
import {Outlet, useNavigate} from 'react-router';
import {useTranslation} from 'react-i18next';
import {RiLogoutBoxLine} from 'react-icons/ri';
import {TOKEN_KEY, REFRESH_TOKEN_KEY} from '../constants';
import logo from '../assets/logo-large.svg';
import {useGetMeQuery} from '../store/api/authApi';

export const Layout = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const {data} = useGetMeQuery();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    navigate('/sign-in');
  };

  return (
    <Container maxW="1400px" p="6" minH="100vh">
      <Flex direction="column" gap="14">
        <Box as="header">
          <Flex align="center" justify="space-between">
            <Image src={logo} alt={t('app.title')} h="36px" />
            <Menu.Root>
              <Menu.Trigger asChild>
                <HStack align="center" gap="2" cursor="pointer">
                  <Avatar.Root variant="subtle" size="xs">
                    <Avatar.Fallback name={data?.username} />
                  </Avatar.Root>
                  <Text fontSize="text.base" color="text-primary">
                    {data?.username}
                  </Text>
                </HStack>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="logout" onClick={handleLogout}>
                      <RiLogoutBoxLine />
                      {t('layout.logout')}
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Box>

        <Box as="main" bg="fill-white" borderRadius="2xl" sm={{p: '10'}} p="4">
          <Outlet />
        </Box>
      </Flex>
    </Container>
  );
};

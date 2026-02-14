import {ReactNode} from 'react';
import {Link as ChakraLink} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router';

interface LinkProps {
  href: string;
  children: ReactNode;
}

export const Link = ({href, children}: LinkProps) => {
  return (
    <ChakraLink asChild color="fill-brand" _hover={{color: 'fill-brand-hover'}} fontWeight="medium">
      <RouterLink to={href}>{children}</RouterLink>
    </ChakraLink>
  );
};

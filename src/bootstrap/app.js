import '../styles/theme.css'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import { Col, Layout, Menu, Row } from 'antd'
import { DrizzleProvider, Initializer } from '../temp/drizzle-react-hooks'
import { Helmet } from 'react-helmet'
import Home from '../containers/home'
import { ReactComponent as Logo } from '../assets/images/logo.svg'
import { StyledText } from '../components/typography'
import React, { useState } from 'react'
import drizzle from './drizzle'
import { register } from './service-worker'
import styled from 'styled-components/macro'
import media from "styled-media-query";
import { default as Footer } from "@kleros/react-components/dist/footer";
import Translations from '../components/translations'

const StyledLogoCol = styled(Col)`
  align-items: center;
  display: flex;
  height: 60px;
  justify-content: space-evenly;
`

const StyledLeftCol = styled(Col)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${media.lessThan("768px")`
    /* screen width is less than 768px (medium) */
    display: none;
  `}
`

const StyledColRight = styled(Col)`
  align-items: right;
  color: white;
  display: flex;
  height: 60px;
  justify-content: space-evenly;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${media.lessThan('992px')`
    /* screen width is less than 768px (medium) */
    display: none;
  `}
`
const StyledMenu = styled(Menu)`
  line-height: 60px !important;
  text-align: center;
`
const StyledLayoutContent = styled(Layout.Content)`
  background-color: transparent;
  padding: 0px 7.575vw 100px 7.575vw;
`
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`

const getDefaultLanguage = () => {
  let language = ((window.navigator.userLanguage || window.navigator.language) || 'en').split('-')[0]
  if (!Translations[language]) language = 'en'
  return language
}

export default () => {
  const [ language, setLanguage ] = useState(getDefaultLanguage())

  return (
    <>
      <Helmet>
        <title>Kleros Token Sale</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i"
          rel="stylesheet"
        />
      </Helmet>
      <DrizzleProvider drizzle={drizzle}>
        <Initializer>
          <BrowserRouter>
            <StyledLayout>
              <Layout.Header>
                <Row>
                  <StyledLogoCol lg={3} md={6}>
                    <Logo />
                  </StyledLogoCol>
                  <StyledLeftCol lg={3} md={10} offset={2}>
                    <a href="https://kleros.io">
                      <StyledText>{Translations[language].header.learnMore}</StyledText>
                    </a>
                  </StyledLeftCol>
                  <StyledColRight lg={10} offset={6}>
                    <StyledText>{Translations[language].header.title}</StyledText>
                    <StyledText>
                      {Translations[language].header.dates}
                    </StyledText>
                  </StyledColRight>
                </Row>
              </Layout.Header>
              <StyledLayoutContent>
                <Switch>
                  <Route component={() => (<Home language={language} />)} exact path="/" />
                </Switch>
              </StyledLayoutContent>
              <Footer
                appName="Token Sale"
                contractExplorerURL={`https://etherscan.io/address/${
                  process.env.REACT_APP_KLEROS_TEST_SALE_ADDRESS
                }#code`}
              />
            </StyledLayout>
          </BrowserRouter>
        </Initializer>
      </DrizzleProvider>
    </>
  )
}

register()

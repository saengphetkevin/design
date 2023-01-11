import React from 'react'
import {ActionMenu, Text, Box, ActionList, ToggleSwitch} from '@primer/react'

const makeNewState = (currentState = {}, newProps) => {
  // copy object
  const newState = {...currentState}
  // update current state with new prop values
  for (const [name, value] of Object.entries(newProps)) {
    newState[name] = value
  }

  return newState
}

const removeSpacesAndEmojis = str => {
  return str.replace(/[\s\p{Emoji}]/gu, '')
}

export default function FigmaComponentExamples({properties, thumbnails}) {
  const [previewState, setPreviewState] = React.useState([])

  React.useEffect(() => {
    // create initial state from default values
    const defaultValues = Object.fromEntries(properties.map(property => [property.name, property.defaultValue]))
    // set initial state
    setPreviewState(makeNewState({}, defaultValues))
  }, [])

  const handleClick = (propertyName, value) => {
    setPreviewState(makeNewState(previewState, {[propertyName]: value}))
  }

  const booleans = properties.filter(property => property.type === 'BOOLEAN')
  const filteredProperties = properties.filter(property => property.type !== 'BOOLEAN')

  return (
    <Box display="grid" gridTemplateColumns={['1fr', null, null, null, '1fr 1fr']} gridGap={5} marginTop={6}>
      <Box
        paddingY={10}
        borderColor="border.muted"
        bg="neutral.subtle"
        borderWidth={1}
        borderRadius={10}
        borderStyle="solid"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
      >
        {thumbnails.map((thumbnail, index) => {
          const curPreviewState = Object.entries(previewState)
          let isActive = curPreviewState.every(([prop, value]) => {
            return value === thumbnail.props[prop]
          })

          const componentName = Object.entries(thumbnail.props)
            .flatMap(propArr => propArr.join(': '))
            .join(', ')

          return (
            isActive && (
              <Box display={'flex'} justifyContent="center" key={index}>
                <img width="50%" src={thumbnail.url} alt={componentName} />
              </Box>
            )
          )
        })}
      </Box>

      <Box display="flex" alignItems="start" flexDirection="column" sx={{gap: 2}} position="sticky">
        {booleans.map((property, index) => {
          return (
            <Box key={index} alignItems={'center'} display={'flex'} width="100%" justifyContent={'space-between'}>
              <Box flexGrow={1} fontSize={2} fontWeight="bold" id={property.name}>
                {removeSpacesAndEmojis(property.name)}
              </Box>
              <ToggleSwitch
                aria-labelledby={property.name}
                onChange={on => handleClick(property.name, on.toString())}
              />
            </Box>
          )
        })}
        {properties.map(property => {
          return (
            <Box
              key={property.name}
              alignItems={'center'}
              display={'flex'}
              width="100%"
              justifyContent={'space-between'}
            >
              <Text fontWeight={'bold'}>{removeSpacesAndEmojis(property.name)}</Text>
              <ActionMenu>
                <ActionMenu.Button aria-label="Select field type">{previewState[property.name]}</ActionMenu.Button>
                <ActionMenu.Overlay>
                  <ActionList selectionVariant="single">
                    {property.values.map(value => (
                      <ActionList.Item
                        key={`${property.name}-${value}`}
                        selected={value === previewState[property.name]}
                        onSelect={() => handleClick(property.name, value)}
                      >
                        {value}
                      </ActionList.Item>
                    ))}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
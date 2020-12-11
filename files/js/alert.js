function yellowAlert(text) {
  if (launchYellowAlert == 1) {
    if (byID('yellow_alert')) byID('yellow_alert').style.animation = 'alert_invisibility 0.1s ease forwards'

    clearTimeout(alertTimeout)
    
    setTimeout(() => {
      if (byID('yellow_text')) byID('yellow_text').textContent = text
    }, 100)

    setTimeout(yellowAlertVisibility, 300)

    alertTimeout = setTimeout(yellowAlertInvisibility, 10e3)
  } else {
    if (launchRedAlert == 1) redAlertInvisibility()
    if (launchBlueAlert == 1) blueAlertInvisibility()

    if (byID('yellow_text')) byID('yellow_text').textContent = text
    if (byID('yellow_alert')) byID('yellow_alert').style.animation = 'alert_visibility 0.5s ease forwards'

    alertTimeout = setTimeout(yellowAlertInvisibility, 10e3)

    launchYellowAlert = 1
  }
}

function yellowAlertVisibility() {
  if (byID('yellow_alert')) byID('yellow_alert').style.animation = 'alert_visibility 0.5s ease forwards'
}

function yellowAlertInvisibility() {
  if (launchYellowAlert == 1) {
    if (byID('yellow_alert')) byID('yellow_alert').style.animation = 'alert_invisibility 0.5s ease forwards'

    setTimeout(() => {
      if (byID('yellow_text')) byID('yellow_text').textContent = 'YELLOW ALERT'
    }, 500)

    launchYellowAlert = 0

    clearTimeout(alertTimeout)
  }
}

function redAlert(text) {
  if (launchRedAlert == 1) {
    if (byID('red_alert')) byID('red_alert').style.animation = 'alert_invisibility 0.1s ease forwards'

    clearTimeout(alertTimeout)
    
    setTimeout(() => {
      if (byID('red_text')) byID('red_text').textContent = text
    }, 100)

    setTimeout(redAlertVisibility, 300)

    alertTimeout = setTimeout(redAlertInvisibility, 10e3)
  } else {
    if (launchYellowAlert == 1) yellowAlertInvisibility()
    if (launchBlueAlert == 1) blueAlertInvisibility()

    if (byID('red_text')) byID('red_text').textContent = text
    if (byID('red_alert')) byID('red_alert').style.animation = 'alert_visibility 0.5s ease forwards'

    alertTimeout = setTimeout(redAlertInvisibility, 10e3)

    launchRedAlert = 1
  }
}

function redAlertVisibility() {
  if (byID('red_alert')) byID('red_alert').style.animation = 'alert_visibility 0.5s ease forwards'
}

function redAlertInvisibility() {
  if (launchRedAlert == 1) {
    if (byID('red_alert')) byID('red_alert').style.animation = 'alert_invisibility 0.5s ease forwards'

    setTimeout(() => {
      if (byID('red_text')) byID('red_text').textContent = 'RED ALERT'
    }, 500)

    launchRedAlert = 0

    clearTimeout(alertTimeout)
  }
}

function blueAlert(text) {
  if (launchBlueAlert == 1) {
    if (byID('blue_alert')) byID('blue_alert').style.animation = 'alert_invisibility 0.1s ease forwards'

    clearTimeout(alertTimeout)

    setTimeout(() => {
      if (byID('blue_text')) byID('blue_text').textContent = text
    }, 100)

    setTimeout(blueAlertVisibility, 300)

    alertTimeout = setTimeout(blueAlertInvisibility, 10e3)
  } else {
    if (launchYellowAlert == 1) yellowAlertInvisibility()
    if (launchRedAlert == 1) redAlertInvisibility()

    if (byID('blue_text')) byID('blue_text').textContent = text
    if (byID('blue_alert')) byID('blue_alert').style.animation = 'alert_visibility 0.5s ease forwards'

    alertTimeout = setTimeout(blueAlertInvisibility, 10e3)

    launchBlueAlert = 1
  }
}

function blueAlertVisibility() {
  if (byID('blue_alert')) byID('blue_alert').style.animation = 'alert_visibility 0.5s ease forwards'
}

function blueAlertInvisibility() {
  if (launchBlueAlert == 1) {
    if (byID('blue_alert')) byID('blue_alert').style.animation = 'alert_invisibility 0.5s ease forwards'

    setTimeout(() => {
      if (byID('blue_text')) byID('blue_text').textContent = 'BLUE ALERT'
    }, 500)

    launchBlueAlert = 0

    clearTimeout(alertTimeout)
  }
}
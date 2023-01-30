import React from 'react'

const LordICried = ({stichera}) => {
  return (
    <>      <p className="rubric">
    Następnie: <span className="rubric--quote">Panie, wołam do Ciebie</span>{" "}
    według wypadającego tonu:
  </p>
  <p className="rubric">Pierwszy chór: </p>
  <p className="first-letter verse">
    P<span className="prayer-incipit">anie, wołam do Ciebie</span>, usłysz
    mnie,
    <span>usłysz mnie, Panie.</span>
  </p>
  <p className="first-letter verse">
    Panie, wołam do Ciebie, usłysz mnie,
    <span>zważ na głos błagania mego, </span>
    gdy wołam do Ciebie, usłysz mnie, Panie.
  </p>
  <p className="rubric">Drugi chór:</p>
  <p className="first-letter verse">
    Niech modlitwa moja
    <span>wznosi się jak dym kadzidlany przed Tobą, </span>
    podniesienie rąk moich rąk
    <span>jak ofiara wieczorna, </span>
    usłysz mnie, Panie.
  </p>
  <p className="rubric">I kolejno stichosy:</p>
  <p className="first-letter verse">
    Postaw, Panie, straż u ust moich,
    <span>wartę u drzwi warg moich.</span>
  </p>
  <p className="first-letter verse">
    Nie skłaniaj serca mego ku złym słowom,
    <span>ku usprawiedliwieniu grzesznych czynów.</span>
  </p>
  <p className="first-letter verse">
    Z ludźmi czyniącymi nieprawość,
    <span>i nie połączę się z wybrańcami ich.</span>
  </p>
  <p className="first-letter verse">
    Niech pouczy mnie sprawiedliwy o łaskawości i niech napomina mnie,
    <span>a olej grzesznika niech nie namaści głowy mojej.</span>
  </p>
  <p className="first-letter verse">
    Modlitwa moja zawsze przeciwko ich złym czynom,
    <span>zgładzeni będą przy skale sędziowie ich.</span>
  </p>
  <p className="first-letter verse">
    Usłuchają słów moich, bo są łagodne,
    <span>jakby kto kopał i rozdzierał ziemię, </span>
    <span>rozsypują się kości ich u wrót otchłani.</span>
  </p>
  <p className="first-letter verse">
    Albowiem ku Tobie, Panie, Panie, podnoszę oczy,
    <span>w Tobie mam nadzieję, nie wydawaj duszy mojej.</span>
  </p>
  <p className="first-letter verse">
    Uchroń mnie od sideł, które zastawili na mnie,
    <span>i od zgorszenia czyniących nieprawość.</span>
  </p>
  <p className="first-letter verse">
    Niech wpadną we własne sieci grzesznicy,
    <span>tam, gdzie ja jeden przejdę bezpiecznie.</span>
  </p>
  <p className="first-letter verse">
    Głosem moim do Pana wołam,
    <span>głosem moim błagam Pana.</span>
  </p>
  <p className="first-letter verse">
    Wylewam przed Nim błaganie moje,
    <span>zgryzotę moją przed Nim wyjawiam.</span>
  </p>
  <p className="first-letter verse">
    Kiedy omdlał we mnie duch mój,
    <span>Ty poznałeś ścieżki moje.</span>
  </p>
  <p className="first-letter verse">
    Na drodze, po której idę,
    <span>ukryli sidła na mnie.</span>
  </p>
  <p className="first-letter verse">
    Spójrz na prawo i zobacz,
    <span>nie masz, kto by mnie znał.</span>
  </p>
  <p className="first-letter verse">
    Nie ma dla mnie ucieczki,
    <span>nikt nie troszczy się o duszę moją.</span>
  </p>
  <p className="first-letter verse">
    Wołam do Ciebie, Panie, i mówię:
    <span>Ty jesteś nadzieją moją, </span>
    <span>cząstką moją w krainie żyjących.</span>
  </p>
  <p className="first-letter verse">
    Usłysz błaganie moje,
    <span>gdyż upokorzony jestem bardzo.</span>
  </p>
  <p className="first-letter verse">
    Wybaw mnie od mych prześladowców,
    <span>gdyż są silniejsi ode mnie.</span>
  </p>
  <p className="rubric">Stichery na 10:</p>
  <p className="first-letter verse">
    Wyprowadź z ciemnicy duszę moją,
    <span>abym wysławiał imię Twoje.</span>
  </p>
  {stichera.length === 11 ? (
    <p className="first-letter propers stichera">{stichera[10]}</p>
  ) : null}
  <p className="first-letter verse">
    Sprawiedliwi oczekują mnie,
    <span>aż Ty dasz mi odpłatę.</span>
  </p>
  {stichera.length >= 10 ? (
    <p className="first-letter propers stichera">{stichera[9]}</p>
  ) : null}
  <p className="rubric">Na 8: </p>
  <p className="first-letter verse">
    Z głębokości wołam do Ciebie, Panie,
    <span>Panie, usłysz głos mój.</span>
  </p>
  {stichera.length >= 9 ? (
    <p className="first-letter propers stichera">{stichera[8]}</p>
  ) : null}
  <p className="first-letter verse">
    Niech uszy Twoje będą uważne
    <span>na głos modlitwy mojej.</span>
  </p>
  {stichera.length >= 8 ? (
    <p className="first-letter propers stichera">{stichera[7]}</p>
  ) : null}
  <p className="rubric">Na 6: </p>
  <p className="first-letter verse">
    Jeżeli będziesz pamiętać o nieprawościach, Panie,
    <span>Panie, któż się ostoi?</span>
    <span>Ale u Ciebie jest oczyszczenie.</span>
  </p>
  <p className="first-letter propers stichera">{stichera[6]}</p>
  <p className="first-letter verse">
    Dla Twego imienia cierpiałem Panie,
    <span>cierpiała dusza moja dla słowa Twego, </span>
    <span>dusza moja ma nadzieję w Panu.</span>
  </p>
  <p className="first-letter propers stichera">{stichera[5]}</p>
  <p className="rubric">Na 4: </p>
  <p className="first-letter verse">
    Od straży porannej do nocy,
    <span>od straży porannej niech Izrael ma nadzieję w Panu.</span>
  </p>
  <p className="first-letter propers stichera">{stichera[4]}</p>
  <p className="first-letter verse">
    Albowiem u Pana jest zmiłowanie i wielkie u Niego wybawienie,
    <span>On sam wybawi Izraela ze wszystkich nieprawości jego.</span>
  </p>
  <p className="first-letter propers stichera">{stichera[3]}</p>
  <p className="first-letter verse">
    Chwalcie Pana wszystkie narody,
    <span>wysławiajcie Go wszyscy ludzie.</span>
  </p>
  <p className="first-letter propers stichera">{stichera[2]}</p>
  <p className="first-letter verse">
    Albowiem miłosierdzie Jego umocnione jest nad nami
    <span>i prawda Pańska trwa na wieki.</span>
  </p>
  <p className="first-letter propers stichera">{stichera[1]}</p>
  <p className="rubric--glory">Chwała, i teraz.</p>
  <p className="first-letter propers stichera">{stichera[0]}</p></>
  )
}

export default LordICried
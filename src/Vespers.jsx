import React from "react";
import { useState, useEffect } from "react";
import GreatEktenia from "./GreatEktenia";
import LittleEktenia from "./LittleEktenia";
import { supabase } from "./supabaseClient";
import { Switch, Space, DatePicker } from "antd";
import RegularInitialPrayers from "./RegularInitialPrayers";

const Vespers = () => {
  let [stichera, setStichera] = useState([]);
  let [aposticha, setAposticha] = useState([]);
  let [prokeimenon, setProkeimenon] = useState([]);
  const [readerView, setReaderView] = useState();
  let [date, setDate] = useState(new Date());

  function getWeeksDiff(startDate, endDate) {
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
console.log("date subtract", (Math.abs(endDate - startDate))/msInWeek)
    return Math.ceil(Math.abs(endDate - startDate) / msInWeek);
  }

  console.log(
    getWeeksDiff(
      new Date("2022-06-25"),
      new Date(date.toISOString().slice(0, 10))
    )
  );

  let weeksDiff = getWeeksDiff(
    new Date("2022-06-25"),
    new Date(date.toISOString().slice(0, 10))
  );
  const getOctoechosTone = (weeksDiff) => {
    let toneNum = 0;
    if (weeksDiff % 8 === 0) {
      toneNum = 8;
    } else {
      toneNum = Math.ceil(weeksDiff % 8);}
    
    console.log("(weeksDiff % 8)",(weeksDiff % 8))
    console.log(weeksDiff)
    console.log(toneNum)
    return toneNum;
  };
  console.log(date.toISOString().slice(0, 10));

  const getStichos = async (tone, day, isAposticha) => {
    let sticheraArray = [];
    let { data: octoechos, error } = await supabase
      .from("octoechos-vespers")
      .select("text")
      .eq("tone", tone)
      .eq("aposticha", isAposticha)
      .eq("weekday", day)
      .order("stichos", { ascending: false });

    let data = octoechos;
    console.log(data);
    data.forEach((el) => (sticheraArray = [...sticheraArray, el.text]));
    console.log(sticheraArray);
    if (!isAposticha) {
      setStichera(sticheraArray);
    } else {
      setAposticha(sticheraArray);
    }
  };

  const getProkeimenon = async (tone, day) => {
    let prokeimenonArray = [];
    let { data: octoechos, error } = await supabase
      .from("octoechos-vespers-prokeimena")
      .select("prokeimenon-1,prokeimenon-2,prokeimenon-3, prokeimenon-4")
      .eq("tone", tone)
      .eq("weekday", day);
    let data = octoechos[0];
    console.log("prokeimena", data);

    for (const [key, value] of Object.entries(data)) {
      prokeimenonArray = [...prokeimenonArray, value];
    }
    console.log(prokeimenonArray);
    let arr = [];
    for (let i = 0; i < prokeimenonArray.length; i++) {
      if (prokeimenonArray[i]) {
        arr.push(prokeimenonArray[i]);
      }
    }

    // let index = prokeimenonArray.indexOf(null);
    // if (index !== -1) {
    //   while (index !== null) {
    //     prokeimenonArray.splice(index, 1);
    //     index = prokeimenonArray.indexOf(null);
    //   }
    // }

    console.log(arr);
    setProkeimenon(arr);
  };
  let day = date.getDay();

  const onDateChange = (dateRaw, dateString) => {
    console.log(dateRaw.$d);
    let dateFormatted = dateRaw.$d;
    setDate(dateFormatted);
    weeksDiff = getWeeksDiff(new Date("2022-06-25"), dateFormatted);
    tone = getOctoechosTone(weeksDiff);
    day = dateFormatted.getDay();
    getStichos(tone, day, false);
    getStichos(tone, day, true);
    getProkeimenon(tone, day);
  };

  let tone = getOctoechosTone(weeksDiff);
  console.log("tone", tone);

  const weekdays = [
    "niedziela",
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
  ];

  useEffect(() => {
    getStichos(tone, day, false);
    getStichos(tone, day, true);
    getProkeimenon(tone, day);
  }, []);

  return (
    <div className="service">
      <div className="service__header">
        <Space direction="horizontal">
          <DatePicker
            onChange={(dateRaw, dateString) =>
              onDateChange(dateRaw, dateString)
            }
          />
          <Switch
            style={{ backgroundColor: "#a8071a" }}
            checkedChildren="Z kapłanem"
            unCheckedChildren="Bez kapłana"
            onChange={(checked, e) => {
              setReaderView(checked, e);
            }}
          />
        </Space>
      </div>
      <h2 className="service-name">Nieszpory</h2>
      <p className="rubric">
        Ton {tone}, {weekdays[day]}
      </p>
      {!readerView ? (
        <RegularInitialPrayers />
      ) : (
        <>
          <p className="rubric">Kapłan:</p>
          <p className="first-letter">
            Błogosławiony Bóg nasz, w każdym czasie, teraz i zawsze, i na wieki
            wieków.
          </p>
        </>
      )}
      <p className="rubric">
        Po <span className="rubric--quote">Amen</span> przełożony lub wyznaczony
        lektor zaczyna psalm wstępny, mówiąc tak:
      </p>
      <p className="first-letter indent">
        Przyjdźcie, pokłońmy się Królowi naszemu Bogu.
      </p>
      <p className="first-letter indent">
        Przyjdźcie, pokłońmy się i przypadnijmy do Chrystusa, Króla naszego i
        Boga.
      </p>
      <p className="first-letter indent">
        Przyjdźcie, pokłońmy się i przypadnijmy do samego Chrystusa, Króla i
        Boga naszego.
      </p>
      <h3 className="service-h3">Psalm 103</h3>
      <p className="first-letter verse">
        Błogosław, duszo moja, Pana,
        <span>Panie, Boże mój, jesteś bardzo wywyższony,</span>w majestat i
        wspaniałość przyoblokłeś się.
        <span>Odziewasz się światłem jak szatą,</span>
        rozpinasz niebiosa jak namiot.
        <span>Pokrywasz wodami górne sklepienie swoje,</span>
        uczyniłeś obłoki rydwanem swoim,
        <span>chodzisz na skrzydłach wiatru.</span>
        Czynisz posłańcami swymi duchy
        <span>i sługami swymi płomienie ognia.</span>
        Założyłeś ziemię na podwalinach jej,
        <span>nie zachwieje się na wieki wieków.</span>
        Głębina jako szata odzienie jej,
        <span>nad górami stanęły wody. </span>
        Na Twoje napomnienie precz odbiegają,
        <span>na głos Twój grzmiący ulękną się. </span>
        Wzniosły się góry i zniżyły się doliny
        <span>do miejsca, któreś im wyznaczył.</span>
        Wyznaczyłeś granicę wodom, której nie przekroczą,
        <span>i nie wrócą, aby pokryć ziemię. </span>
        Ty prowadzisz źródła do strumieni,
        <span>między górami płyną wody. </span>
        Pić dają każdemu zwierzowi polnemu,
        <span>dzikie osły gaszą w nich pragnienie swoje. </span>
        Na nich ptactwo niebieskie mieszka,
        <span>spośród kamieni wydaje głos. </span>
        Ty wody posyłasz na góry z komnat Twoich
        <span>i owocem dzieł Twoich nasyca się ziemia. </span>
        Ty sprawiasz, że rośnie trawa dla bydła
        <span>i ziele na służbę człowiekowi, </span>
        aby z ziemi dobywał chleb.
        <span>I wino weseli serce człowiecze, </span>
        jaśnieje oblicze jego od oliwy,
        <span>i chleb serce człowieka umacnia. </span>
        Napojone są drzewa polne,
        <span>cedry Libanu, któreś zasadził. </span>
        Tam gnieżdżą się ptaki,
        <span>a gniazdo bociana góruje nad nimi.</span>
        Góry wysokie są dla jeleni,
        <span>skały na schronienie dla zajęcy. </span>
        Uczyniłeś księżyc miarą czasów,
        <span>słońce zachód swój poznało. </span>
        Sprowadzasz ciemności i nastaje noc,
        <span>w niej krążą wszelkie zwierzęta leśne. </span>
        Młode lwy rykiem domagają się żeru,
        <span>żądają od Boga pokarmu swego. </span>
        Kiedy słońce wzejdzie, ustępują,
        <span>i kładą się w swoich legowiskach. </span>
        Wychodzi człowiek do pracy swojej,
        <span>do trudu swego aż do wieczora.</span>
        Jakże wspaniałe są dzieła Twoje, Panie,
        <span>wszystkie w mądrości uczyniłeś, </span>
        <span>pełna jest ziemia dzieł Twoich.</span>
        Oto morze wielkie i rozległe,
        <span>a w nim płazy niezliczone, </span>
        <span>zwierzęta małe z wielkimi. </span>
        Tam przepływają okręty
        <span>i ów smok, którego stworzyłeś,</span>
        aby go wyszydzić. Wszystko czeka na Ciebie,
        <span>abyś dał im pokarm we właściwym czasie. </span>
        Dajesz im i zbierają,
        <span>otwierasz dłoń Twoją</span>
        <span>i wszyscy napełniają się dobrami. </span>
        Kryjesz oblicze Twoje i trwożą się,
        <span>odbierasz im ducha i giną,</span>
        <span>i w proch swój się obracają. </span>
        Posyłasz ducha Twego i zostają stworzone,
        <span>i odnawiasz oblicze ziemi. </span>
        Chwała Pańska niech będzie na wieki,
        <span>rozraduje się Pan dziełami swoimi. </span>
        Spojrzy na ziemię i trzęsie się ona,
        <span>dotknie gór i one dymią. </span>
        Śpiewać będę Panu póki żyję,
        <span>śpiewam Bogu memu, póki jestem. </span>
        Oby przyjemna Mu była mowa moja,
        <span>ja zaś weselić się będę w Panu. </span>
        Niech znikną grzesznicy z ziemi
        <span>i niech ludzi nieprawych nie będzie. </span>
        Błogosław, duszo moja, Pana.
      </p>
      <p className="first-letter verse margin-text">
        Słońce zachód swój poznało,
        <span>sprowadzasz ciemność i nastaje noc. </span>
        Jakże wspaniałe są dzieła Twoje, Panie,
        <span>wszystkie w mądrości uczyniłeś.</span>
      </p>
      <p className="first-letter verse margin-text">
        Chwała Ojcu i Synowi, i Świętemu Duchowi,
        <span>i teraz, i zawsze, i na wieki wieków. Amen.</span>
      </p>
      <p className="first-letter indent margin-text">
        Alleluja. Alleluja. Alleluja, chwała Tobie, Boże
        <span className="rubric"> (trzy razy)</span>.
      </p>
      {!readerView ? (
        <>
          <p className="rubric">
            Następnie: <span className="rubric--quote">Panie, zmiłuj się</span>{" "}
            12 razy.
          </p>
          <p className="first-letter indent">
            Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na
            wieki wieków.
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Chór:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Także wielka ektenia.</p>
          <GreatEktenia />
        </>
      )}
      <p className="rubric">Recytacja Psałterza.</p>
      {!readerView ? (
        <>
          <p className="rubric">
            Następnie: <span className="rubric--quote">Panie, zmiłuj się</span>{" "}
            3 razy.
          </p>
          <p className="first-letter indent">
            Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na
            wieki wieków.{" "}
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Chór:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Po recytacji mała ektenia:</p>
          <LittleEktenia />
        </>
      )}
      <p className="rubric">
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
      <p className="first-letter propers stichera">{stichera[0]}</p>
      <p className="rubric">Hymn Sofroniusza, patriarchy jerozolimskiego:</p>
      <p className="first-letter indent">
        P<span className="prayer-incipit">ogodna światłości</span> świętej
        chwały, nieśmiertelnego Ojca niebios, Świętego, Błogosławionego, Jezu
        Chryste. Przyszliśmy na zachód słońca, widząc światłość wieczorną
        śpiewamy Ojcu, Synowi, i Świętemu Duchowi, Bogu, boś godzien jest, by w
        każdym czasie, śpiewano Tobie zbożnymi pieśniami, Synu Boży, co życie
        dajesz, przeto świat Cię sławi.
      </p>
      <p className="rubric">
        Należy wiedzieć, że gdy jest Wielki Post lub śpiewamy
        <span className="rubric--quote">Alleluja</span>, to zamiast prokimenonów
        dni tygodnia śpiewamy:
      </p>
      <p className="rubric">PROKIMENONY???</p>
      <p className="rubric">
        W niedzielę i w piątek wieczorem nigdy nie śpiewa się Alleluja.
      </p>
      <p className="rubric">
        Jeśli natomiast śpiewano Bóg i Pan, to śpiewamy te prokimenony:
      </p>
      <div className="propers">
        {prokeimenon.length <= 2 ? (
          <>
            <p className="first-letter indent">{prokeimenon[0]}</p>
            <div className="prokeimenon">
              <p className="rubric">Stichos:</p>
              <p className="first-letter indent">{prokeimenon[1]}</p>
            </div>
          </>
        ) : (
          <>
            <p className="first-letter indent">{prokeimenon[0]}</p>
            <div className="prokeimenon">
              <p className="rubric">Stichos 1:</p>
              <p className="first-letter indent">{prokeimenon[1]}</p>
            </div>
            <div className="prokeimenon">
              <p className="rubric">Stichos 2:</p>
              <p className="first-letter indent">{prokeimenon[2]}</p>
            </div>
            <div className="prokeimenon">
              <p className="rubric">Stichos 3:</p>
              <p className="first-letter indent">{prokeimenon[3]}</p>
            </div>
          </>
        )}
      </div>
      <p className="rubric">I po prokimenonie mówi:</p>
      <p className="first-letter verse">
        P<span className="prayer-incipit">ozwól, Panie</span>, w wieczór ten
        <span>ustrzec się nam od grzechu. </span>
        Błogosławiony jesteś, Panie, Boże ojców naszych,
        <span>i chwalebne i przesławne jest imię Twoje na wieki. Amen.</span>
      </p>
      <p className="first-letter verse">
        Niech miłosierdzie Twoje, Panie, będzie nad nami,
        <span>jak mieliśmy nadzieję w Tobie. </span>
        Błogosławiony jesteś, Panie,
        <span>naucz mnie przykazań Twoich.</span>
        Błogosławiony jesteś, Władco,
        <span>daj mi zrozumieć przykazania Twoje.</span>
        Błogosławiony jesteś, Święty,
        <span>oświeć mnie przykazaniami Twoimi. </span>
        Panie, miłosierdzie Twoje na wieki,
        <span>nie gardź dziełem rąk Twoich. </span>
      </p>
      <p className="first-letter verse">
        Tobie przynależy sława,
        <span>Tobie przynależy pieśń, </span>
        <span>Tobie chwała przynależy, </span>
        Ojcu i Synowi, i Świętemu Duchowi,
        <span>teraz i zawsze, i na wieki wieków. Amen. </span>
      </p>
      {!readerView ? (
        <>
          <p className="rubric">
            Następnie: <span className="rubric--quote">Panie, zmiłuj się</span>{" "}
            12 razy.
          </p>
          <p className="first-letter indent">
            Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na
            wieki wieków.
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Chór:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Kapłan:</p>
          Dopełnijmy wieczorną modlitwę naszą do Pana.
        </>
      )}
      <p className="rubric">
        Po ekfonesis stichery na stichownie, wśród których mówimy te isomelosy,
        jeśli nie ma święta Pańskiego.
      </p>
      <p className="first-letter propers stichera">{aposticha[3]}</p>
      <p className="rubric">Stichos 1: </p>
      <p className="first-letter verse">
        Do Ciebie wznoszę oczy moje,
        <span>który mieszkasz w niebie. </span>
        Oto jak oczy sług zwrócone są na ręce ich panów
        <span>i jak oczy służącej na ręce jej pani, </span>
        tak oczy nasze ku Bogu, Bogu naszemu,
        <span>dopóki nie ulituje się nad nami.</span>
      </p>
      <p className="first-letter propers stichera">{aposticha[2]}</p>
      <p className="rubric">Stichos 2: </p>
      <p className="first-letter verse">
        Zmiłuj się nad nami, Panie, zmiłuj się nad nami,
        <span>albowiem wzgardą jesteśmy nasyceni. </span>
        Dusza nasza nasycona jest szyderstwem zarozumialców
        <span>i wzgardą pyszałków.</span>
      </p>
      <p className="first-letter propers stichera">{aposticha[1]}</p>
      <p className="rubric">
        Jeśli jest sobota, mówimy Pan zakrólował, jak to wskazano (s. ). Jeśli
        wypadanie święto Pańskie, to jego stichosy. Tak samo, jeśli wypadnie
        wspomnienie świętego.
      </p>
      <p className="rubric">
        <span className="rubric--glory">Chwała, i teraz.</span>
      </p>{" "}
      <p className="rubric">Teotokion:</p>
      <p className="first-letter propers stichera">{aposticha[0]}</p>
      <p className="rubric">Także modlitwa świętego Symeona Starca:</p>
      <p className="first-letter indent">
        T<span className="prayer-incipit">eraz pozwalasz odejść</span> słudze
        Twemu, Władco, według słowa Twego, w pokoju, Bowiem oczy moje widziały
        zbawienie Twoje, któreś przygotował wobec wszystkich ludzi, Światłość na
        oświecenie narodów i chwałę ludu Twego, Izraela.
      </p>
      <p className="first-letter indent" style={{ marginTop: "10px" }}>
        Święty Boże, Święty Mocny, Święty Nieśmiertelny, zmiłuj się nad nami
        (trzy razy).
      </p>
      <p className="first-letter indent">
        Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na wieki
        wieków. Amen.
      </p>
      <p className="first-letter indent">
        Najświętsza Trójco, zmiłuj się nad nami, Panie, oczyść grzechy nasze,
        Władco, przebacz nieprawości nasze, Święty, nawiedź nas, i ulecz niemoce
        nasze, dla imienia Twego.
      </p>
      <p className="first-letter indent">Panie, zmiłuj się (trzy razy).</p>
      <p className="first-letter indent">
        Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na wieki
        wieków. Amen.
      </p>
      <p className="first-letter indent">
        Ojcze nasz, któryś jest w niebiesiech, święć się imię Twoje, przyjdź
        królestwo Twoje, bądź wola Twoja, jako w niebie tak i na ziemi, chleba
        naszego powszedniego daj nam dzisiaj, i odpuść nam nasze winy, jako i my
        odpuszczamy naszym winowajcom, i nie wwódź nas w pokuszenie, ale nas
        zbaw ode złego.
      </p>
      <p className="first-letter indent">
        Panie Jezu Chryste, Synu Boży, zmiłuj się nad nami.{" "}
      </p>
      <div className="ektenia__choir">
        <p className="rubric">Chór:</p> Amen.
      </div>
      <p className="rubric">
        Troparion wypadającego święta lub świętego, bądź dnia.
        <span className="rubric--glory"> Chwała, i teraz. </span>
      </p>
      <p className="rubric">Teotokion: </p>
      <p className="rubric">Rozesłanie</p>
    </div>
  );
};

export default Vespers;

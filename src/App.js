import axios from 'axios';
import { Fragment, useState } from 'react';
import './App.scss';

function App() {
  const [tipoVeiculo, setTipoVeiculo] = useState();
  const [marcaVeiculo, setMarcaVeiculo] = useState();
  const [modeloVeiculo, setModeloVeiculo] = useState();
  const [anoVeiculo, setAnoVeiculo] = useState();
  const [marcas, setMarcas] = useState();
  const [modelos, setModelos] = useState();
  const [anos, setAnos] = useState();
  const [resultado, setResultado] = useState();
  const [divResultado, setDivResultado] = useState(false);
  const [mensagemErro, setMensagemErro] = useState();

  async function consultarFipe(event) {
    event.preventDefault();

    const ultimoSelect = document.querySelector("#anos-veiculo").value

    if (ultimoSelect !== "default") {
      const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaVeiculo}/modelos/${modeloVeiculo}/anos/${anoVeiculo}`);
      setMensagemErro();
    
      setResultado(response.data)
      setDivResultado(true);
      console.log(resultado.AnoModelo)
    } else {
      setMensagemErro("É necessário selecionar todos os campos.");
    }
  }

  function resetarCampos() {
    setMarcas();
    setModelos();
    setAnos();

    setDivResultado(false);
    setMensagemErro();
  }

  async function getMarcas(e) {
    setMarcas();
    setModelos();
    setAnos();
    const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/${e.target.value}/marcas`);
    setMarcas(response.data);
    setTipoVeiculo(e.target.value)
  }

  async function getModelos(e) {
    setModelos();
    setAnos();
    const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${e.target.value}/modelos`);
    setModelos(response.data.modelos);
    setMarcaVeiculo(e.target.value)
  }

  async function getAnos(e) {
    setAnos();
    const response = await axios.get(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaVeiculo}/modelos/${e.target.value}/anos`);
    setAnos(response.data);
    setModeloVeiculo(e.target.value)
  }

  document.title = "Consultar tabela FIPE";

  return (
    <Fragment>
      <form onSubmit={consultarFipe} onReset={resetarCampos}>
        <div className='titulo-form'>
          <h1>Consulte o preço médio de um veículo</h1>
        </div>
        <div className='campo-form'>
          <label htmlFor='tipo-veiculo'>Tipo de Veículo</label>
          <select id='tipo-veiculo' required defaultValue={"default"} onChange={(e) => {getMarcas(e)}}>
            <option value="default">Selecione</option>
            <option value="motos">Moto</option>
            <option value="carros">Carro</option>
            <option value="caminhoes">Caminhão</option>
          </select>
        </div>
        <div className='campo-form'>
          <label htmlFor='marca-veiculo'>Marca</label>
          <select id='marca-veiculo' required defaultValue={"default"} onChange={(e) => {getModelos(e)}}>
            <option value="default">Selecione</option>
            { marcas?.map((item, index) =>
                <option value={item.codigo} key={index}>{item.nome}</option>
            )}
          </select>
        </div>
        <div className='campo-form'>
          <label htmlFor='modelo-veiculo'>Modelo</label>
          <select id='modelo-veiculo' required defaultValue={"default"} onChange={(e) => {getAnos(e)}}>
            <option value="default">Selecione</option>
            { modelos?.map((item, index) =>
                <option value={item.codigo} key={index}>{item.nome}</option>
            )}
          </select>
        </div>
        <div className='campo-form'>
          <label htmlFor='anos-veiculo'>Ano de Fabricação</label>
          <select id='anos-veiculo' required onChange={(e) => {setAnoVeiculo(e.target.value)}}>
            <option value="default">Selecione</option>
            { anos?.map((item, index) =>
                <option value={item.codigo} key={index}>{item.nome.includes("32000") ? item.nome.replace("32000","Zero KM") : item.nome}</option>
            )}
          </select>
        </div>
        <button type='reset'>Cancelar</button>
        <button type='submit'>Buscar</button>
        { mensagemErro !== undefined ? <h3>{mensagemErro}</h3> : null}
      </form>
      { divResultado ? 
        <div id='resultado'>
          <h2>Resultado:</h2>
          <ul>
            <li>
              <h5>Marca:</h5>
              <h6>{resultado.Marca}</h6>
            </li>
            <li>
              <h5>Modelo:</h5>
              <h6>{resultado.Modelo}</h6>
            </li>
            <li>
              <h5>Ano:</h5>
              <h6>{resultado.AnoModelo === 32000 ? "Zero KM" : resultado.AnoModelo }</h6>
            </li>
            <li>
              <h5>Combustível:</h5>
              <h6>{resultado.Combustivel}</h6>
            </li>
            <li>
              <h5>Código FIPE:</h5>
              <h6>{resultado.CodigoFipe}</h6>
            </li>
          </ul>
          <br/>
          <h4>{resultado.Valor}</h4>
        </div>
      : null }
    </Fragment>
  );
}

export default App;
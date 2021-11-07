import React, { useState, useEffect, useRef } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

class BIDashBoard extends React.Component {

  render(){
const srcLink = 'https://app.powerbi.com/reportEmbed?reportId=36ea9c8a-1e81-450d-baf2-247ebd3e255b&autoAuth=true&ctid=89cf11d4-079d-47a6-af93-e6ae64ceb42c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D';
var html_src = 'data:text/html;charset=utf-8,' + srcLink;
  return(
    <div id="PowerBIEmbed"> 

    {/* <iframe src={src} height={600} width={600}/>       */}

	{/* <PowerBIEmbed
	embedConfig = {{
		type: 'dashboard',   // Supported types: report, dashboard, tile, visual and qna
		id: 'b18b5801-dc88-4d7c-80e7-0cc452126857', 
		embedUrl: src,
		accessToken: "Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IkYtdC03NWo3NVNGczZqMmFEY1AxcVdRVzUxSFM1M0xWVWJ4VEZxQjc1Q2MiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OWNmMTFkNC0wNzlkLTQ3YTYtYWY5My1lNmFlNjRjZWI0MmMvIiwiaWF0IjoxNjM0MTMwMDMwLCJuYmYiOjE2MzQxMzAwMzAsImV4cCI6MTYzNDEzMzkzMCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhUQUFBQWkxWDFDd3ozTkIvWEVvR2loMVNOelNrYkVtMGgzblFDc0JvSjJyZ3Iwa1JKQ2NBSHl0NUFqbklzOGo1c05aQ3lOTkUwVVBrTGZoZHZJMnp5WTQyMldBPT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IkNvbnZlcnNpb24tRmFjdG9yeSIsImFwcGlkIjoiODExYmExMTctZWRhZS00Zjg0LWEwMzctNmJmYTAzNmM3YTJhIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJWaXN3YW5hdGgiLCJnaXZlbl9uYW1lIjoiSmFuZ2FsYSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE0LjE0My4xNzAuMTA1IiwibmFtZSI6IkphbmdhbGEgVmlzd2FuYXRoIiwib2lkIjoiMDI3MjljY2ItNjU5NC00MGY5LTg4MTgtMzYwNzUzMjZkNGIwIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAxOERDNUUyRUUiLCJyaCI6IjAuQVZzQTFCSFBpWjBIcGtldmstYXVaTTYwTEJlaEc0R3U3WVJQb0Rkci1nTnNlaXBiQUlFLiIsInNjcCI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoicnRjYmhxUmZWb2tyX0xTcHFTQUpOeGFENkxleGJISjR6RmdyVDZnYXVYQSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6Ijg5Y2YxMWQ0LTA3OWQtNDdhNi1hZjkzLWU2YWU2NGNlYjQyYyIsInVuaXF1ZV9uYW1lIjoiamFuZ2FsYS52aXN3YW5hdGhAaW50ZWxsaXN3aWZ0LmNvbSIsInVwbiI6ImphbmdhbGEudmlzd2FuYXRoQGludGVsbGlzd2lmdC5jb20iLCJ1dGkiOiI4SFRUcUJyaEZrbWJOTEE0OGZaeEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6InRzRl9OTkViMXVwRUU4dkg2YWdRQV9fVWhrZ1ZQZ09UOUI1UElsYmtrZXMifSwieG1zX3RjZHQiOjEzMzYyOTkwNTJ9.W8fzaB8YUCNRW9sDxFK6qO6z6dHX0B_hui8GCRfebQ5H7Z9gNpRKtywRyT4Aa73yTsWIWhQZFnfKrNxMZratIhiky9LH8QOwZoW81z2aketPEH-r0uQ3-9_JUletk3u5H2ZJcSaVbrU30c8KBCanvbkXZeAdgrQxCAN1-gsgu_UkOvt86hHMO8mN7aVCDZCqkOeOM015XIqsog-ONaxuYQQVwzUcQTYaaA7FcXoYVmHUhV0TBPqVvZxqh24PqkJA4NWebvo72oLPTOTs-qnY0yhxPhFDiTpNQb6-bbRGhb3xbdvfklGdKISnCIRk5LlXQvPOn1WnkpPhPsF0CSO2YA",    // Keep as empty string, null or undefined
		tokenType: models.TokenType.Embed
	}}

/> */}
<iframe width="1140" height="541.25" src={srcLink} frameborder="0" allowFullScreen="true"></iframe>
{/* <iframe src={src} /> */}
    {/* <PowerBIEmbed id="power-bi"
	embedConfig = {{
		type: 'report',   // Supported types: report, dashboard, tile, visual and qna
		id: 1,
		embedUrl: src,
		accessToken: "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjNqbzJwWEN6ZzVmWkxPMHFmRU1oYlJsN3pGWGJ4aU10MVRNdXhlS2ZJdjQiLCJhbGciOiJSUzI1NiIsIng1dCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCIsImtpZCI6Imwzc1EtNTBjQ0g0eEJWWkxIVEd3blNSNzY4MCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OWNmMTFkNC0wNzlkLTQ3YTYtYWY5My1lNmFlNjRjZWI0MmMvIiwiaWF0IjoxNjM0MTE5ODUxLCJuYmYiOjE2MzQxMTk4NTEsImV4cCI6MTYzNDEyMzc1MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhUQUFBQWVmaFcwMFYzcEZIVFNmL2lMb0JqYjNoZjUzcGdSZFlKQWRoWVByRG5RWGU4UE9kRDEvRUZ3WTJPUUFSN0hIdXEwZmZGWnJGSmJJcFdic2hwUUV4Qzl3PT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IkNvbnZlcnNpb24tRmFjdG9yeSIsImFwcGlkIjoiODExYmExMTctZWRhZS00Zjg0LWEwMzctNmJmYTAzNmM3YTJhIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJWaXN3YW5hdGgiLCJnaXZlbl9uYW1lIjoiSmFuZ2FsYSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjQ5LjM3LjE0NC4zNiIsIm5hbWUiOiJKYW5nYWxhIFZpc3dhbmF0aCIsIm9pZCI6IjAyNzI5Y2NiLTY1OTQtNDBmOS04ODE4LTM2MDc1MzI2ZDRiMCIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMThEQzVFMkVFIiwicmgiOiIwLkFWc0ExQkhQaVowSHBrZXZrLWF1Wk02MExCZWhHNEd1N1lSUG9EZHItZ05zZWlwYkFJRS4iLCJzY3AiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInN1YiI6InJ0Y2JocVJmVm9rcl9MU3BxU0FKTnhhRDZMZXhiSEo0ekZnclQ2Z2F1WEEiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI4OWNmMTFkNC0wNzlkLTQ3YTYtYWY5My1lNmFlNjRjZWI0MmMiLCJ1bmlxdWVfbmFtZSI6ImphbmdhbGEudmlzd2FuYXRoQGludGVsbGlzd2lmdC5jb20iLCJ1cG4iOiJqYW5nYWxhLnZpc3dhbmF0aEBpbnRlbGxpc3dpZnQuY29tIiwidXRpIjoiNTM2dU1RRVJSVVd2T3lEX1o5MHJBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJ0c0ZfTk5FYjF1cEVFOHZINmFnUUFfX1Voa2dWUGdPVDlCNVBJbGJra2VzIn0sInhtc190Y2R0IjoxMzM2Mjk5MDUyfQ.bPjQrr2_0izuDOitsdFO_9vvFhJ6SEre4CiTfV5_j4uWIUwydBHARXkvSga_2BH-o3Tzx31cTvncIBjvecKJHNZmYsMoBdv39L9MVK24X7yG972ZPtyrAdLWaKxfaGEz0Zv6AxmWavlugU5iQv2lmSVemXy1aDjRYGdbwjy1WUGfhNpARlnter_sz1KhBt7jOVL-_hpocZ8L8enRQYXwd8tdzY0PV-Dp-dc2HBb13Cdp_YkqALpFKD_sHcoQURFY-ttrt2U0S0osT5wT6Y6UIiEdVdi_8DXYAMRlbo7X5gjjA-E7OiYlJq-uWk5-4XS0I5m8VE1CazuMtxHq4o6ZSw",
		tokenType: models.TokenType.Embed,
		settings: {
			panes: {
				filters: {
					expanded: false,
					visible: false
				}
			},
			background: models.BackgroundType.Transparent,
		}
	}}

	eventHandlers = { 
		new Map([
			['loaded', function () {console.log('Report loaded');}],
			['rendered', function () {console.log('Report rendered');}],
			['error', function (event) {console.log(event.detail);}]
		])
	}
		
	cssClassName = { "report-style-class" }

	getEmbeddedComponent = { (embeddedReport) => {
		this.report = embeddedReport;
	}}
/>   */}
    </div>
  )}
}
  
  export default BIDashBoard;
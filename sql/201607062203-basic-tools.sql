-- random base 36 string of length <len>
CREATE OR REPLACE FUNCTION random_string(len integer)
  RETURNS text AS
$BODY$
	declare
		wynik_ text;
		i_ int;
		r_ int;
	begin
		wynik_ := '';
		for i_ in 1..len loop
			r_ := round(random()*36*36)::int % 36;
			if r_ >= 10 then
				r_ := 97+r_-10;
			else
				r_ := 48 + r_;
			end if;
			wynik_ := wynik_ || chr(r_);
		end loop;
		return wynik_;
	end;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;

-- crypto shortcut for sha1
CREATE OR REPLACE FUNCTION sha1(text) returns text AS $$
	SELECT encode(digest($1, 'sha1'), 'hex')
$$ LANGUAGE SQL STRICT IMMUTABLE;

-- crypto shortcut for sha256
CREATE OR REPLACE FUNCTION sha256(text) returns text AS $$
	SELECT encode(digest($1, 'sha256'), 'hex')
$$ LANGUAGE SQL STRICT IMMUTABLE;

-- generate hash for <password>, <salt>
CREATE OR REPLACE FUNCTION salted_hash(text, text) returns text AS $$
	SELECT $2||'.'||sha256($2||$1)
$$ LANGUAGE SQL STRICT IMMUTABLE;

-- generate hash for <password> and random hash
CREATE OR REPLACE FUNCTION salted_hash(text) returns text AS $$
	SELECT salted_hash($1, random_string(32))
$$ LANGUAGE SQL STRICT volatile;

-- check if hash is correct for given <password>, <hash>
CREATE OR REPLACE FUNCTION salted_hash_check(text, text) returns boolean AS $$
	SELECT salted_hash($1, split_part($2,'.',1)) = $2
$$ LANGUAGE SQL STRICT IMMUTABLE;